// تعريفات مخصصة لـ pdfjs-dist لحل مشاكل التوافق

import * as PDFJS from 'pdfjs-dist';

declare module 'pdfjs-dist' {
  export interface RenderParameters {
    canvasContext: CanvasRenderingContext2D;
    viewport: PageViewport;
    canvas?: HTMLCanvasElement;
  }

  export interface PDFPageProxy {
    render(params: RenderParameters): {
      promise: Promise<void>;
    };
  }
}
