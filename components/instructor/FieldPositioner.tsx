'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { TemplateField, FieldType, CanvasDimensions } from '@/types/field';
import TextCustomizer from './TextCustomizer';
import { Plus, Trash2, ArrowRight, Save, User, Calendar, Hash, Type } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';

// تكوين PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface FieldPositionerProps {
  file: File;
  onSave: (fields: TemplateField[], dimensions: CanvasDimensions) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

const FIELD_TYPES: { type: FieldType; label: string; icon: any; sampleText: string }[] = [
  { type: 'student_name', label: 'اسم الطالب', icon: User, sampleText: 'أحمد محمد' },
  { type: 'date', label: 'التاريخ', icon: Calendar, sampleText: '2024-01-15' },
  { type: 'certificate_number', label: 'رقم الشهادة', icon: Hash, sampleText: 'CERT-001' },
  { type: 'custom', label: 'حقل مخصص', icon: Type, sampleText: 'نص مخصص' },
];

export default function FieldPositioner({ file, onSave, onBack, isSubmitting }: FieldPositionerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<CanvasDimensions>({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // تحميل الصورة أو PDF
  useEffect(() => {
    const loadFile = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (file.type === 'application/pdf') {
        // تحميل PDF
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          const page = await pdf.getPage(1);
          
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          setDimensions({ width: viewport.width, height: viewport.height });

          await page.render({
            canvasContext: ctx,
            viewport: viewport,
          } as any).promise;

          setImageLoaded(true);
        } catch (error) {
          console.error('Error loading PDF:', error);
          alert('حدث خطأ في تحميل ملف PDF');
        }
      } else {
        // تحميل صورة
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          setDimensions({ width: img.width, height: img.height });
          ctx.drawImage(img, 0, 0);
          setImageLoaded(true);
        };
        img.src = URL.createObjectURL(file);
      }
    };

    loadFile();
  }, [file]);

  // إعادة رسم Canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // إعادة رسم الصورة
    if (file.type !== 'application/pdf') {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        drawFields(ctx);
      };
      img.src = URL.createObjectURL(file);
    } else {
      // بالنسبة لـ PDF، نحتاج إعادة تحميله
      const loadPDF = async () => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });
        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        } as any).promise;
        drawFields(ctx);
      };
      loadPDF();
    }
  }, [file, imageLoaded, fields]);

  // رسم الحقول
  const drawFields = (ctx: CanvasRenderingContext2D) => {
    fields.forEach((field) => {
      // رسم دائرة للعلامة
      const isSelected = selectedField === field.id;
      const markerRadius = 8;

      // رسم ظل
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      // رسم الدائرة
      ctx.beginPath();
      ctx.arc(field.x, field.y, markerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isSelected ? '#4F46E5' : '#6366F1';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // رسم النص التجريبي
      ctx.font = `${field.fontWeight} ${field.fontSize}px ${field.fontFamily}`;
      ctx.fillStyle = field.fontColor;
      ctx.textAlign = field.textAlign;
      
      const sampleText = field.sampleText || field.label;
      const maxWidth = (dimensions.width * field.maxWidthPercent) / 100;
      
      let textX = field.x;
      if (field.textAlign === 'right') {
        textX = field.x + maxWidth / 2;
      } else if (field.textAlign === 'left') {
        textX = field.x - maxWidth / 2;
      }

      ctx.fillText(sampleText, textX, field.y + field.fontSize + 15, maxWidth);

      // رسم Label
      ctx.font = 'bold 12px Cairo';
      ctx.fillStyle = isSelected ? '#4F46E5' : '#6B7280';
      ctx.textAlign = 'center';
      ctx.fillText(field.label, field.x, field.y - 15);
    });
  };

  // إعادة الرسم عند تغيير الحقول
  useEffect(() => {
    if (imageLoaded) {
      redrawCanvas();
    }
  }, [fields, selectedField, imageLoaded, redrawCanvas]);

  // معالج النقر على Canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // التحقق من النقر على حقل موجود
    const clickedField = fields.find((field) => {
      const distance = Math.sqrt(Math.pow(field.x - x, 2) + Math.pow(field.y - y, 2));
      return distance <= 12; // نصف قطر أكبر قليلاً للنقر
    });

    if (clickedField) {
      setSelectedField(clickedField.id);
    } else {
      setSelectedField(null);
    }
  };

  // معالج بدء السحب
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedField = fields.find((field) => {
      const distance = Math.sqrt(Math.pow(field.x - x, 2) + Math.pow(field.y - y, 2));
      return distance <= 12;
    });

    if (clickedField) {
      setDraggedField(clickedField.id);
      setDragOffset({ x: x - clickedField.x, y: y - clickedField.y });
      setSelectedField(clickedField.id);
    }
  };

  // معالج السحب
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedField) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === draggedField
          ? {
              ...field,
              x,
              y,
              xPercent: (x / dimensions.width) * 100,
              yPercent: (y / dimensions.height) * 100,
            }
          : field
      )
    );
  };

  // معالج انتهاء السحب
  const handleMouseUp = () => {
    setDraggedField(null);
  };

  // إضافة حقل جديد
  const addField = (type: FieldType) => {
    const fieldConfig = FIELD_TYPES.find((f) => f.type === type);
    if (!fieldConfig) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const newField: TemplateField = {
      id: crypto.randomUUID(),
      type,
      label: fieldConfig.label,
      x: centerX,
      y: centerY,
      xPercent: 50,
      yPercent: 50,
      fontFamily: 'Cairo',
      fontSize: 24,
      fontColor: '#000000',
      fontWeight: 'normal',
      textAlign: 'center',
      maxWidthPercent: 50,
      sampleText: fieldConfig.sampleText,
    };

    setFields([...fields, newField]);
    setSelectedField(newField.id);
  };

  // حذف الحقل المحدد
  const deleteSelectedField = () => {
    if (!selectedField) return;
    setFields(fields.filter((f) => f.id !== selectedField));
    setSelectedField(null);
  };

  // تحديث حقل
  const updateField = (updates: Partial<TemplateField>) => {
    if (!selectedField) return;
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === selectedField ? { ...field, ...updates } : field
      )
    );
  };

  // حفظ
  const handleSave = async () => {
    if (fields.length === 0) {
      alert('يرجى إضافة حقل واحد على الأقل');
      return;
    }

    await onSave(fields, dimensions);
  };

  const selectedFieldData = fields.find((f) => f.id === selectedField);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* منطقة Canvas */}
      <div className="lg:col-span-2 space-y-4">
        {/* أزرار إضافة الحقول */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Plus size={20} className="text-indigo-600" />
            إضافة حقل
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FIELD_TYPES.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <button
                  key={fieldType.type}
                  onClick={() => addField(fieldType.type)}
                  className="flex flex-col items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                >
                  <Icon size={24} className="text-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div ref={containerRef} className="overflow-auto max-h-[600px]">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="border border-gray-300 cursor-crosshair max-w-full"
            />
          </div>
          
          {!imageLoaded && (
            <div className="text-center py-8 text-gray-500">
              جاري تحميل القالب...
            </div>
          )}
        </div>

        {/* الإرشادات */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-bold text-blue-900 mb-2">كيفية الاستخدام:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• انقر على زر "إضافة حقل" لإضافة حقل جديد</li>
            <li>• اسحب العلامات لتغيير مواقعها</li>
            <li>• انقر على علامة لتحديدها وتخصيص خصائصها</li>
            <li>• استخدم لوحة التخصيص على اليسار لتعديل النص</li>
            <li>• اضغط على "حفظ القالب" عند الانتهاء</li>
          </ul>
        </div>
      </div>

      {/* لوحة التحكم */}
      <div className="space-y-4">
        {/* معلومات */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">معلومات</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">العرض:</span>
              <span className="font-medium">{Math.round(dimensions.width)}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الارتفاع:</span>
              <span className="font-medium">{Math.round(dimensions.height)}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">عدد الحقول:</span>
              <span className="font-medium">{fields.length}</span>
            </div>
          </div>
        </div>

        {/* قائمة الحقول */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">الحقول ({fields.length})</h3>
          {fields.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              لم تتم إضافة أي حقول بعد
            </p>
          ) : (
            <div className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
                  onClick={() => setSelectedField(field.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    selectedField === field.id
                      ? 'bg-indigo-100 border-2 border-indigo-500'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{field.label}</span>
                  {selectedField === field.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSelectedField();
                      }}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* تخصيص الحقل المحدد */}
        {selectedFieldData && (
          <TextCustomizer field={selectedFieldData} onUpdate={updateField} />
        )}

        {/* أزرار الإجراءات */}
        <div className="space-y-2">
          <button
            onClick={handleSave}
            disabled={isSubmitting || fields.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSubmitting ? 'جاري الحفظ...' : 'حفظ القالب'}
          </button>

          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            <ArrowRight size={20} />
            السابق
          </button>

          {selectedField && (
            <button
              onClick={deleteSelectedField}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            >
              <Trash2 size={20} />
              حذف الحقل المحدد
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
