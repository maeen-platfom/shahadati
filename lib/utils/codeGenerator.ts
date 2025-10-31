/**
 * دوال مساعدة لتوليد الأكواد السرية والروابط الفريدة
 */

/**
 * توليد كود سري عشوائي
 * @param length - طول الكود (افتراضي: 8)
 * @returns كود سري مثل "CERT2025A"
 */
export function generateAccessCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // تجنب الحروف المتشابهة (I, O, 0, 1)
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
}

/**
 * توليد رابط فريد للشهادة
 * @param length - طول الرابط (افتراضي: 12)
 * @returns string فريد للرابط
 */
export function generateUniqueLink(length: number = 12): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let link = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    link += chars[randomIndex];
  }
  
  return link;
}

/**
 * توليد رقم شهادة فريد
 * @param prefix - بادئة رقم الشهادة (مثل "CERT")
 * @returns رقم شهادة مثل "CERT-2025-001234"
 */
export function generateCertificateNumber(prefix: string = 'CERT'): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
  return `${prefix}-${year}-${random}`;
}

/**
 * التحقق من صحة الكود (تنسيق فقط)
 * @param code - الكود المراد التحقق منه
 * @returns true إذا كان التنسيق صحيحاً
 */
export function isValidCodeFormat(code: string): boolean {
  // يجب أن يكون من 6 إلى 12 حرف، حروف وأرقام فقط
  return /^[A-Z0-9]{6,12}$/.test(code);
}
