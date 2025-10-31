/**
 * إعدادات التشفير لمنصة شهاداتي
 * Encryption Settings Component for Shahadati Platform
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Key, 
  Shield, 
  Settings, 
  Save, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Zap
} from 'lucide-react';
import { 
  EncryptionSettings as EncryptionSettingsType, 
  EncryptionMethod, 
  SensitiveDataType 
} from '@/types/security';
import { 
  encryptData, 
  decryptData, 
  generateKey, 
  calculateChecksum,
  DEFAULT_ENCRYPTION_SETTINGS 
} from '@/lib/utils/security';

export default function EncryptionSettings() {
  const [settings, setSettings] = useState<EncryptionSettingsType>(DEFAULT_ENCRYPTION_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<EncryptionSettingsType>(DEFAULT_ENCRYPTION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [testData, setTestData] = useState('بيانات تجريبية للتشفير');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    encrypted?: string;
    decrypted?: string;
  } | null>(null);

  // جلب الإعدادات عند تحميل المكون
  useEffect(() => {
    loadEncryptionSettings();
  }, []);

  // تحميل إعدادات التشفير
  const loadEncryptionSettings = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/security/encryption');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setOriginalSettings(data);
      }
    } catch (error) {
      console.error('خطأ في تحميل إعدادات التشفير:', error);
    } finally {
      setLoading(false);
    }
  };

  // حفظ الإعدادات
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/security/encryption', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        setOriginalSettings(settings);
        setTestResult({
          success: true,
          message: 'تم حفظ إعدادات التشفير بنجاح'
        });
        
        // إخفاء النتيجة بعد 3 ثوانٍ
        setTimeout(() => setTestResult(null), 3000);
      } else {
        throw new Error('فشل في حفظ الإعدادات');
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'فشل في حفظ الإعدادات: ' + error.message
      });
    } finally {
      setSaving(false);
    }
  };

  // إعادة تعيين الإعدادات
  const handleReset = () => {
    setSettings(originalSettings);
  };

  // توليد مفتاح جديد
  const handleGenerateKey = () => {
    const newKey = generateKey(settings.keyLength);
    setEncryptionKey(newKey);
  };

  // اختبار التشفير
  const handleTestEncryption = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      
      let key = encryptionKey;
      if (!key) {
        key = generateKey(settings.keyLength);
        setEncryptionKey(key);
      }
      
      // تشفير البيانات التجريبية
      const encrypted = encryptData(testData, key, settings);
      const decrypted = decryptData(encrypted, key, settings);
      
      const success = decrypted === testData;
      
      setTestResult({
        success,
        message: success 
          ? 'نجح اختبار التشفير والفك' 
          : 'فشل في اختبار التشفير',
        encrypted,
        decrypted
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'خطأ في اختبار التشفير: ' + error.message
      });
    } finally {
      setTesting(false);
    }
  };

  // نسخ المفتاح
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-lg">جاري تحميل إعدادات التشفير...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="h-8 w-8 text-blue-600 ml-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إعدادات التشفير</h1>
              <p className="text-gray-600">إدارة وتخصيص إعدادات التشفير والأمان</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4 ml-2" />
              إعادة تعيين
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 ml-2" />
              {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </button>
          </div>
        </div>
      </div>

      {/* حالة الاختبار */}
      {testResult && (
        <div className={`border rounded-lg p-4 ${
          testResult.success 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {testResult.success ? (
              <CheckCircle className="h-5 w-5 ml-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 ml-2" />
            )}
            <span className="font-medium">{testResult.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الإعدادات الأساسية */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Settings className="h-6 w-6 text-gray-600 ml-2" />
            <h2 className="text-xl font-semibold text-gray-900">الإعدادات الأساسية</h2>
          </div>

          <div className="space-y-6">
            {/* تفعيل التشفير */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">تفعيل التشفير</label>
                <p className="text-sm text-gray-500">تشغيل أو إيقاف نظام التشفير</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* طريقة التشفير */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                طريقة التشفير
              </label>
              <select
                value={settings.method}
                onChange={(e) => setSettings({...settings, method: e.target.value as EncryptionMethod})}
                disabled={!settings.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value={EncryptionMethod.AES_256_GCM}>AES-256-GCM (موصى به)</option>
                <option value={EncryptionMethod.AES_256_CBC}>AES-256-CBC</option>
                <option value={EncryptionMethod.RSA_2048}>RSA-2048</option>
                <option value={EncryptionMethod.RSA_4096}>RSA-4096 (الأكثر أماناً)</option>
              </select>
            </div>

            {/* طول المفتاح */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                طول المفتاح (بايت)
              </label>
              <select
                value={settings.keyLength}
                onChange={(e) => setSettings({...settings, keyLength: Number(e.target.value)})}
                disabled={!settings.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value={16}>128-bit (16 بايت)</option>
                <option value={24}>192-bit (24 بايت)</option>
                <option value={32}>256-bit (32 بايت)</option>
                <option value={48}>384-bit (48 بايت)</option>
                <option value={64}>512-bit (64 بايت)</option>
              </select>
            </div>

            {/* عدد التكرارات */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد التكرارات (PBKDF2)
              </label>
              <input
                type="number"
                value={settings.iterations}
                onChange={(e) => setSettings({...settings, iterations: Number(e.target.value)})}
                disabled={!settings.enabled}
                min="1000"
                max="1000000"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
              <p className="text-sm text-gray-500 mt-1">
                المزيد من التكرارات = أمان أعلى ولكن أداء أبطأ
              </p>
            </div>

            {/* التشفير التلقائي */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">التشفير التلقائي</label>
                <p className="text-sm text-gray-500">تشفير البيانات الجديدة تلقائياً</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoEncrypt}
                  onChange={(e) => setSettings({...settings, autoEncrypt: e.target.checked})}
                  disabled={!settings.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* تشفير البيانات الحساسة */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">تشفير البيانات الحساسة</label>
                <p className="text-sm text-gray-500">حماية البيانات الشخصية والمحاسمة</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.encryptSensitiveData}
                  onChange={(e) => setSettings({...settings, encryptSensitiveData: e.target.checked})}
                  disabled={!settings.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* تشفير النسخ الاحتياطية */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">تشفير النسخ الاحتياطية</label>
                <p className="text-sm text-gray-500">حماية النسخ الاحتياطية بالتشفير</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.backupEncryption}
                  onChange={(e) => setSettings({...settings, backupEncryption: e.target.checked})}
                  disabled={!settings.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* اختبار التشفير */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Zap className="h-6 w-6 text-yellow-600 ml-2" />
            <h2 className="text-xl font-semibold text-gray-900">اختبار التشفير</h2>
          </div>

          <div className="space-y-6">
            {/* بيانات الاختبار */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                بيانات الاختبار
              </label>
              <textarea
                value={testData}
                onChange={(e) => setTestData(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل البيانات المراد تشفيرها..."
              />
            </div>

            {/* المفتاح */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  مفتاح التشفير
                </label>
                <button
                  onClick={handleGenerateKey}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  توليد مفتاح جديد
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type={showKeys ? 'text' : 'password'}
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل المفتاح أو اتركه فارغاً للتوليد التلقائي"
                  />
                  
                  <button
                    onClick={() => setShowKeys(!showKeys)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {encryptionKey && (
                  <button
                    onClick={() => copyToClipboard(encryptionKey)}
                    className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* زر الاختبار */}
            <button
              onClick={handleTestEncryption}
              disabled={testing || !settings.enabled}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 ml-2" />
                  اختبار التشفير
                </>
              )}
            </button>

            {/* نتائج الاختبار */}
            {testResult && testResult.encrypted && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البيانات المشفرة
                  </label>
                  <div className="relative">
                    <textarea
                      value={testResult.encrypted}
                      readOnly
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(testResult.encrypted!)}
                      className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البيانات بعد فك التشفير
                  </label>
                  <div className="relative">
                    <textarea
                      value={testResult.decrypted}
                      readOnly
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(testResult.decrypted!)}
                      className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Checksum: {calculateChecksum(testResult.encrypted).substring(0, 16)}...</span>
                  <span className="text-green-600">✓ ناجح</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* أنواع البيانات الحساسة */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-red-600 ml-2" />
          <h2 className="text-xl font-semibold text-gray-900">البيانات الحساسة المحمية</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(SensitiveDataType).map((type) => (
            <div key={type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {getSensitiveDataTypeLabel(type)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {getSensitiveDataTypeDescription(type)}
                  </p>
                </div>
                {settings.encryptSensitiveData && (
                  <Lock className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * وظائف مساعدة
 */
function getSensitiveDataTypeLabel(type: SensitiveDataType): string {
  const labels = {
    [SensitiveDataType.PERSONAL_INFO]: 'المعلومات الشخصية',
    [SensitiveDataType.CERTIFICATE_DATA]: 'بيانات الشهادات',
    [SensitiveDataType.TEMPLATE_CONTENT]: 'محتوى القوالب',
    [SensitiveDataType.ACCESS_CODE]: 'رموز الوصول',
    [SensitiveDataType.STUDENT_RECORD]: 'سجلات الطلاب'
  };
  return labels[type] || type;
}

function getSensitiveDataTypeDescription(type: SensitiveDataType): string {
  const descriptions = {
    [SensitiveDataType.PERSONAL_INFO]: 'أسماء وعناوين وهواتف المستخدمين',
    [SensitiveDataType.CERTIFICATE_DATA]: 'محتوى وتفاصيل الشهادات الصادرة',
    [SensitiveDataType.TEMPLATE_CONTENT]: 'تصاميم وقوالب الشهادات',
    [SensitiveDataType.ACCESS_CODE]: 'رموز الوصول والأكواد السرية',
    [SensitiveDataType.STUDENT_RECORD]: 'بيانات وسجلات الطلاب'
  };
  return descriptions[type] || '';
}