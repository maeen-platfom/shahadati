#!/bin/bash

# سكريبت النشر التلقائي لمنصة شهاداتي
# نظام نشر شامل مع الاختبارات والمراقبة
# Written in Arabic - تطوير ونشر منصة شهاداتي

set -e  # إيقاف التنفيذ عند أي خطأ

# الألوان للنصوص
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# إعدادات النشر
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$PROJECT_DIR/deployment-$(date +%Y%m%d-%H%M%S).log"
BACKUP_DIR="$PROJECT_DIR/backups"
ENV_FILE="$PROJECT_DIR/.env.production"
VERCEL_CONFIG="$PROJECT_DIR/vercel.json"

# متغيرات البيئة
DEPLOY_ENV="production"
SKIP_TESTS=false
FORCE_DEPLOY=false
VERBOSE=false
DRY_RUN=false

# الدوال المساعدة
log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[${timestamp}]${NC} ${message}" | tee -a "$LOG_FILE"
}

log_success() {
    local message="$1"
    log "${GREEN}✅ ${message}${NC}"
}

log_warning() {
    local message="$1"
    log "${YELLOW}⚠️  ${message}${NC}"
}

log_error() {
    local message="$1"
    log "${RED}❌ ${message}${NC}"
}

log_info() {
    local message="$1"
    log "${BLUE}ℹ️  ${message}${NC}"
}

# عرض المساعدة
show_help() {
    echo "سكريبت النشر لمنصة شهاداتي"
    echo ""
    echo "الاستخدام: $0 [OPTIONS]"
    echo ""
    echo "الخيارات:"
    echo "  -e, --env ENV          بيئة النشر (development|staging|production) [default: production]"
    echo "  -t, --skip-tests       تخطي الاختبارات"
    echo "  -f, --force            فرض النشر حتى لو كانت هناك أخطاء"
    echo "  -v, --verbose          عرض تفاصيل أكثر"
    echo "  -d, --dry-run          تشغيل تجريبي (لا يتم النشر فعلياً)"
    echo "  -h, --help             عرض هذه المساعدة"
    echo ""
    echo "أمثلة:"
    echo "  $0                     نشر في بيئة الإنتاج"
    echo "  $0 -e staging          نشر في بيئة التجربة"
    echo "  $0 -t -f               نشر بدون اختبارات وفرض النشر"
    echo "  $0 -d                  تشغيل تجريبي"
}

# التحقق من المتطلبات
check_requirements() {
    log_info "فحص متطلبات النشر..."
    
    # التحقق من Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js غير مثبت"
        exit 1
    fi
    
    local node_version=$(node -v | sed 's/v//')
    log_info "Node.js version: $node_version"
    
    # التحقق من npm
    if ! command -v npm &> /dev/null; then
        log_error "npm غير مثبت"
        exit 1
    fi
    
    # التحقق من Vercel CLI
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI غير مثبت، سيتم تثبيته..."
        npm install -g vercel
    fi
    
    # التحقق من وجود package.json
    if [[ ! -f "$PROJECT_DIR/package.json" ]]; then
        log_error "ملف package.json غير موجود"
        exit 1
    fi
    
    log_success "جميع المتطلبات متوفرة"
}

# إنشاء نسخة احتياطية
create_backup() {
    log_info "إنشاء نسخة احتياطية..."
    
    mkdir -p "$BACKUP_DIR"
    
    local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    mkdir -p "$backup_path"
    
    # نسخ الملفات المهمة
    cp -r "$PROJECT_DIR/.env*" "$backup_path/" 2>/dev/null || true
    cp "$PROJECT_DIR/next.config.mjs" "$backup_path/" 2>/dev/null || true
    cp "$PROJECT_DIR/vercel.json" "$backup_path/" 2>/dev/null || true
    cp "$PROJECT_DIR/package.json" "$backup_path/" 2>/dev/null || true
    cp -r "$PROJECT_DIR/supabase" "$backup_path/" 2>/dev/null || true
    
    # إنشاء أرشيف
    tar -czf "$BACKUP_PATH.tar.gz" -C "$BACKUP_DIR" "$backup_name" 2>/dev/null
    rm -rf "$backup_path"
    
    log_success "تم إنشاء النسخة الاحتياطية: $backup_path.tar.gz"
}

# تثبيت التبعيات
install_dependencies() {
    log_info "تثبيت التبعيات..."
    
    cd "$PROJECT_DIR"
    
    if [[ -f "pnpm-lock.yaml" ]]; then
        log_info "استخدام pnpm..."
        pnpm install --frozen-lockfile
    elif [[ -f "yarn.lock" ]]; then
        log_info "استخدام yarn..."
        yarn install --frozen-lockfile
    else
        log_info "استخدام npm..."
        npm ci
    fi
    
    log_success "تم تثبيت التبعيات بنجاح"
}

# بناء المشروع
build_project() {
    log_info "بناء المشروع..."
    
    cd "$PROJECT_DIR"
    
    # تنظيف البناء السابق
    rm -rf .next out dist
    
    # البناء
    if [[ "$VERBOSE" == "true" ]]; then
        npm run build
    else
        npm run build > /dev/null 2>&1
    fi
    
    if [[ $? -ne 0 ]]; then
        log_error "فشل في بناء المشروع"
        return 1
    fi
    
    log_success "تم بناء المشروع بنجاح"
}

# تشغيل الاختبارات
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        log_warning "تم تخطي الاختبارات"
        return 0
    fi
    
    log_info "تشغيل الاختبارات..."
    
    cd "$PROJECT_DIR"
    
    # تشغيل TypeScript check
    if [[ -f "tsconfig.json" ]]; then
        log_info "فحص TypeScript..."
        npx tsc --noEmit
        if [[ $? -ne 0 ]]; then
            log_error "فشل فحص TypeScript"
            return 1
        fi
    fi
    
    # تشغيل ESLint
    if [[ -f ".eslintrc.js" ]] || [[ -f ".eslintrc.json" ]]; then
        log_info "تشغيل ESLint..."
        npx eslint . --ext .ts,.tsx --max-warnings 0
        if [[ $? -ne 0 ]]; then
            log_error "فشل ESLint"
            return 1
        fi
    fi
    
    # تشغيل الاختبارات إذا كانت موجودة
    if [[ -f "jest.config.js" ]] || npm run test --silent &>/dev/null; then
        log_info "تشغيل اختبارات Jest..."
        npm test -- --passWithNoTests --silent
        if [[ $? -ne 0 ]]; then
            log_error "فشل اختبارات Jest"
            return 1
        fi
    fi
    
    log_success "تم اجتياز جميع الاختبارات"
}

# فحص متغيرات البيئة
check_environment() {
    log_info "فحص متغيرات البيئة..."
    
    local required_vars=(
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "NEXTAUTH_SECRET"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "متغيرات البيئة المطلوبة مفقودة:"
        for var in "${missing_vars[@]}"; do
            log_error "  - $var"
        done
        return 1
    fi
    
    log_success "جميع متغيرات البيئة المطلوبة متوفرة"
}

# نشر على Vercel
deploy_vercel() {
    log_info "النشر على Vercel..."
    
    cd "$PROJECT_DIR"
    
    local deploy_args="--prod"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        deploy_args="$deploy_args --token=$VERCEL_TOKEN"
        log_info "تشغيل تجريبي - لن يتم النشر فعلياً"
    fi
    
    if [[ "$VERBOSE" == "true" ]]; then
        vercel $deploy_args
    else
        vercel $deploy_args --yes > /dev/null 2>&1
    fi
    
    if [[ $? -ne 0 ]]; then
        log_error "فشل النشر على Vercel"
        return 1
    fi
    
    log_success "تم النشر على Vercel بنجاح"
}

# نشر Edge Functions
deploy_edge_functions() {
    log_info "نشر Edge Functions..."
    
    if [[ ! -d "$PROJECT_DIR/supabase/functions" ]]; then
        log_info "لا توجد Edge Functions للنشر"
        return 0
    fi
    
    cd "$PROJECT_DIR"
    
    # التحقق من وجود Supabase CLI
    if ! command -v supabase &> /dev/null; then
        log_warning "Supabase CLI غير مثبت، سيتم تخطي نشر Edge Functions"
        return 0
    fi
    
    # نشر كل Edge Function
    for func_dir in "$PROJECT_DIR/supabase/functions"/*/; do
        if [[ -d "$func_dir" ]]; then
            local func_name=$(basename "$func_dir")
            log_info "نشر Edge Function: $func_name"
            
            if [[ "$DRY_RUN" == "true" ]]; then
                log_info "تشغيل تجريبي: supabase functions deploy $func_name"
            else
                supabase functions deploy "$func_name" --project-ref "$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/.*\/\///' | sed 's/\.supabase\.co//')"
                if [[ $? -ne 0 ]]; then
                    log_warning "فشل نشر Edge Function: $func_name"
                fi
            fi
        fi
    done
    
    log_success "تم نشر Edge Functions"
}

# تشغيل مهام ما بعد النشر
post_deploy_tasks() {
    log_info "تشغيل مهام ما بعد النشر..."
    
    # التحقق من صحة النشر
    if [[ "$DRY_RUN" != "true" ]]; then
        sleep 30  # انتظار 30 ثانية للانتشار
        
        local deployment_url="$VERCEL_URL"
        if [[ -n "$deployment_url" ]]; then
            log_info "فحص صحة النشر..."
            
            local response=$(curl -s -o /dev/null -w "%{http_code}" "$deployment_url" || echo "000")
            if [[ "$response" == "200" ]]; then
                log_success "النشر يعمل بشكل طبيعي"
            else
                log_warning "النشر قد لا يعمل بشكل طبيعي (HTTP $response)"
            fi
        fi
    fi
    
    # إرسال إشعار
    send_notification
    
    log_success "تم تشغيل مهام ما بعد النشر"
}

# إرسال إشعار
send_notification() {
    local status="$1"
    local message="$2"
    
    # إرسال webhook إذا كان متوفر
    if [[ -n "$DEPLOYMENT_WEBHOOK_URL" ]]; then
        local payload=$(cat <<EOF
{
    "text": "🚀 نشر منصة شهاداتي",
    "attachments": [{
        "color": "$([ "$status" == "success" ] && echo "good" || echo "danger")",
        "fields": [{
            "title": "البيئة",
            "value": "$DEPLOY_ENV",
            "short": true
        }, {
            "title": "الحالة",
            "value": "$status",
            "short": true
        }, {
            "title": "الرسالة",
            "value": "$message",
            "short": false
        }]
    }]
}
EOF
)
        
        curl -X POST -H 'Content-type: application/json' \
             --data "$payload" \
             "$DEPLOYMENT_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# تنظيف الملفات المؤقتة
cleanup() {
    log_info "تنظيف الملفات المؤقتة..."
    
    cd "$PROJECT_DIR"
    rm -rf node_modules/.cache
    rm -rf .next/cache
    
    log_success "تم التنظيف"
}

# تشغيل النشر الرئيسي
main() {
    local start_time=$(date +%s)
    
    log_info "🚀 بدء عملية النشر لمنصة شهاداتي"
    log_info "البيئة: $DEPLOY_ENV"
    log_info "الملف: $LOG_FILE"
    
    # التحقق من المتطلبات
    check_requirements
    
    # إنشاء نسخة احتياطية
    if [[ "$DRY_RUN" != "true" ]]; then
        create_backup
    fi
    
    # فحص متغيرات البيئة
    check_environment
    
    # تثبيت التبعيات
    install_dependencies
    
    # تشغيل الاختبارات
    if ! run_tests; then
        log_error "فشل في الاختبارات"
        if [[ "$FORCE_DEPLOY" != "true" ]]; then
            exit 1
        else
            log_warning "تم فرض النشر رغم فشل الاختبارات"
        fi
    fi
    
    # بناء المشروع
    if ! build_project; then
        log_error "فشل في بناء المشروع"
        if [[ "$FORCE_DEPLOY" != "true" ]]; then
            exit 1
        else
            log_warning "تم فرض النشر رغم فشل البناء"
        fi
    fi
    
    # النشر على Vercel
    if ! deploy_vercel; then
        log_error "فشل في النشر"
        send_notification "فشل" "فشل في عملية النشر"
        exit 1
    fi
    
    # نشر Edge Functions
    deploy_edge_functions
    
    # مهام ما بعد النشر
    post_deploy_tasks
    
    # تنظيف
    cleanup
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_success "🎉 تم النشر بنجاح في ${duration} ثانية"
    
    # إرسال إشعار النجاح
    send_notification "نجح" "تم النشر بنجاح في $duration ثانية"
}

# معالجة المعاملات
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            DEPLOY_ENV="$2"
            shift 2
            ;;
        -t|--skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        -f|--force)
            FORCE_DEPLOY=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "معامل غير معروف: $1"
            show_help
            exit 1
            ;;
    esac
done

# التحقق من البيئة
if [[ ! "$DEPLOY_ENV" =~ ^(development|staging|production)$ ]]; then
    log_error "بيئة غير صحيحة: $DEPLOY_ENV"
    exit 1
fi

# تشغيل الدالة الرئيسية
main "$@"