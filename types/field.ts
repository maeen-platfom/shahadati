export type FieldType = 'student_name' | 'date' | 'certificate_number' | 'custom';

export interface TemplateField {
  id: string;
  type: FieldType;
  label: string;
  x: number; // موقع البكسل الفعلي على Canvas
  y: number;
  xPercent: number; // الموقع كنسبة مئوية
  yPercent: number;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  maxWidthPercent: number;
  sampleText?: string; // نص تجريبي للعرض
}

export interface CanvasDimensions {
  width: number;
  height: number;
}
