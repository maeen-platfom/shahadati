'use client';

import { TemplateField } from '@/types/field';
import { Type, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextCustomizerProps {
  field: TemplateField;
  onUpdate: (updates: Partial<TemplateField>) => void;
}

const FONT_FAMILIES = [
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

const FONT_COLORS = [
  { value: '#000000', label: 'أسود' },
  { value: '#FFFFFF', label: 'أبيض' },
  { value: '#1F2937', label: 'رمادي غامق' },
  { value: '#6B7280', label: 'رمادي' },
  { value: '#3B82F6', label: 'أزرق' },
  { value: '#10B981', label: 'أخضر' },
  { value: '#EF4444', label: 'أحمر' },
  { value: '#F59E0B', label: 'برتقالي' },
  { value: '#8B5CF6', label: 'بنفسجي' },
];

export default function TextCustomizer({ field, onUpdate }: TextCustomizerProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <Type className="text-indigo-600" size={20} />
        <h3 className="font-bold text-gray-900">تخصيص النص</h3>
      </div>

      {/* نوع الخط */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          نوع الخط
        </label>
        <select
          value={field.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* حجم الخط */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          حجم الخط: {field.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="72"
          step="2"
          value={field.fontSize}
          onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>12</span>
          <span>72</span>
        </div>
      </div>

      {/* لون الخط */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          لون الخط
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FONT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => onUpdate({ fontColor: color.value })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                field.fontColor === color.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-5 h-5 rounded border border-gray-300"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-xs">{color.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-600 mb-1">أو اختر لون مخصص:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={field.fontColor}
              onChange={(e) => onUpdate({ fontColor: e.target.value })}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={field.fontColor}
              onChange={(e) => onUpdate({ fontColor: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* سمك الخط */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          سمك الخط
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdate({ fontWeight: 'normal' })}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${
              field.fontWeight === 'normal'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            عادي
          </button>
          <button
            onClick={() => onUpdate({ fontWeight: 'bold' })}
            className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
              field.fontWeight === 'bold'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            عريض
          </button>
        </div>
      </div>

      {/* محاذاة النص */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          محاذاة النص
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdate({ textAlign: 'right' })}
            className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              field.textAlign === 'right'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AlignRight size={16} />
            <span className="text-sm">يمين</span>
          </button>
          <button
            onClick={() => onUpdate({ textAlign: 'center' })}
            className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              field.textAlign === 'center'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AlignCenter size={16} />
            <span className="text-sm">وسط</span>
          </button>
          <button
            onClick={() => onUpdate({ textAlign: 'left' })}
            className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              field.textAlign === 'left'
                ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <AlignLeft size={16} />
            <span className="text-sm">يسار</span>
          </button>
        </div>
      </div>

      {/* العرض الأقصى */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          العرض الأقصى: {field.maxWidthPercent}%
        </label>
        <input
          type="range"
          min="20"
          max="100"
          step="5"
          value={field.maxWidthPercent}
          onChange={(e) => onUpdate({ maxWidthPercent: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>20%</span>
          <span>100%</span>
        </div>
      </div>

      {/* النص التجريبي */}
      {field.type === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تسمية الحقل
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="مثال: اسم المدرب"
          />
        </div>
      )}
    </div>
  );
}
