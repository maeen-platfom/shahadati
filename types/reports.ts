// أنواع البيانات لنظام التقارير والإحصائيات

export interface ReportConfig {
  title: string;
  type: 'monthly' | 'yearly' | 'custom' | 'summary';
  period: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  groupBy: 'day' | 'week' | 'month' | 'year';
  filters: {
    status?: string;
    template?: string;
    instructor?: string;
  };
}

export interface ReportData {
  title: string;
  data: any[];
  totalRecords: number;
  summary: {
    [key: string]: number;
  };
}

export interface ExportData {
  title: string;
  data: any[];
  headers?: string[];
  metadata?: {
    generatedAt: Date;
    period?: string;
    totalRecords: number;
  };
}

export interface AnalyticsData {
  trends: {
    certificates_issued: Array<{ date: string; value: number; growth?: number }>;
    users_registered: Array<{ date: string; value: number; growth?: number }>;
    revenue: Array<{ date: string; value: number; growth?: number }>;
  };
  kpis: {
    total_certificates: number;
    total_users: number;
    total_revenue: number;
    avg_processing_time: number;
    growth_rate: number;
    conversion_rate: number;
  };
  templates_performance: Array<{
    name: string;
    certificates: number;
    percentage: number;
    color: string;
  }>;
  user_analytics: {
    new_users: number;
    active_users: number;
    returning_users: number;
    churn_rate: number;
    avg_session_duration: number;
  };
  comparison: {
    current_period: any;
    previous_period: any;
    improvements: string[];
  };
}

export interface DashboardStats {
  totalCertificates: number;
  totalUsers: number;
  totalRevenue: number;
  processingTime: number;
  growthRate: number;
  activeTemplates: number;
}

export interface RecentActivity {
  id: string;
  type: 'certificate_issued' | 'user_registered' | 'template_created' | 'payment_received';
  description: string;
  timestamp: Date;
  amount?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  color?: string;
}

export interface KPI {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  icon?: string;
  color?: string;
}

export interface TemplateAnalytics {
  id: string;
  name: string;
  usage_count: number;
  success_rate: number;
  avg_processing_time: number;
  revenue: number;
  last_used: Date;
  category: string;
}

export interface UserAnalytics {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_week: number;
  new_users_month: number;
  retention_rate: number;
  avg_session_duration: number;
  bounce_rate: number;
  user_growth_rate: number;
}

export interface FinancialAnalytics {
  total_revenue: number;
  revenue_today: number;
  revenue_week: number;
  revenue_month: number;
  revenue_growth_rate: number;
  avg_transaction_value: number;
  total_transactions: number;
  refunds: number;
  refunds_rate: number;
}

export interface SystemHealth {
  uptime: number;
  response_time: number;
  error_rate: number;
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
  active_connections: number;
}

export interface AlertConfig {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  recipients: string[];
  enabled: boolean;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// أنواع المخططات البيانية
export type ChartType = 
  | 'line' 
  | 'area' 
  | 'bar' 
  | 'pie' 
  | 'doughnut' 
  | 'scatter' 
  | 'radar' 
  | 'bubble';

export interface ChartConfig {
  type: ChartType;
  title: string;
  description?: string;
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  animations?: boolean;
  colors?: string[];
}

// أنواع الفلاتر
export interface FilterConfig {
  dateRange: {
    start: Date;
    end: Date;
  };
  status?: string[];
  category?: string[];
  template?: string[];
  instructor?: string[];
  userType?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
}

// أنواع التصدير
export type ExportFormat = 'excel' | 'pdf' | 'csv' | 'json' | 'png' | 'svg';

export interface ExportOptions {
  format: ExportFormat;
  includeCharts: boolean;
  includeMetadata: boolean;
  customFilename?: string;
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'A3' | 'Letter';
}

// أنواع المقاييس
export interface MetricDefinition {
  key: string;
  name: string;
  description: string;
  type: 'count' | 'sum' | 'average' | 'percentage' | 'ratio';
  unit?: string;
  decimals?: number;
  format?: 'number' | 'currency' | 'percentage' | 'duration';
  category: 'certificates' | 'users' | 'financial' | 'system' | 'templates';
}

// أنواع التقارير المحددة مسبقاً
export interface PredefinedReport {
  id: string;
  name: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  config: ReportConfig;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
  isActive: boolean;
}

// أنواع البيانات المحفوظة
export interface SavedReport {
  id: string;
  name: string;
  description?: string;
  config: ReportConfig;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  owner: string;
  tags: string[];
}

// أنواع المخططات التفاعلية
export interface InteractiveChart {
  id: string;
  title: string;
  config: ChartConfig;
  interactivity: {
    zoom: boolean;
    pan: boolean;
    tooltip: boolean;
    legend: boolean;
    dataLabels: boolean;
  };
  annotations?: {
    [key: string]: any;
  };
}

// أنواع التحليلات التنبؤية
export interface PredictiveAnalytics {
  metric: string;
  current_value: number;
  predicted_value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  trend: 'increasing' | 'decreasing' | 'stable';
  prediction_date: Date;
  factors: string[];
}

// أنواع التنبيهات الذكية
export interface SmartAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'performance' | 'security' | 'financial' | 'usage';
  triggered_at: Date;
  resolved_at?: Date;
  status: 'active' | 'resolved' | 'dismissed';
  actions: {
    label: string;
    url: string;
    style: 'primary' | 'secondary' | 'danger';
  }[];
}