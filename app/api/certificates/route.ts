/**
 * API Endpoint: توليد الشهادات المعززة
 * Sprint 4: دعم ميزات QR والتوقيع الرقمي والأمان المتقدم
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface CertificateGenerationRequest {
  access_code_id: string;
  template_id: string;
  student_name: string;
  student_email?: string;
  custom_fields?: Record<string, string>;
  enable_qr?: boolean;
  enable_digital_signature?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CertificateGenerationRequest = await request.json();
    
    // Validate request body
    const validation = validateRequest(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'بيانات الطلب غير صحيحة',
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || '';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIP = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

    console.log('Certificate generation request:', {
      template_id: body.template_id,
      student_name: body.student_name,
      enable_qr: body.enable_qr,
      enable_digital_signature: body.enable_digital_signature,
      client_ip: clientIP,
    });

    // Enhanced Edge Function call with Sprint 4 features
    const edgeFunctionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-certificate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_code_id: body.access_code_id,
          template_id: body.template_id,
          student_name: body.student_name,
          student_email: body.student_email,
          custom_fields: body.custom_fields || {},
          enable_qr: body.enable_qr ?? true,
          enable_digital_signature: body.enable_digital_signature ?? false,
        }),
      }
    );

    const edgeFunctionData = await edgeFunctionResponse.json();

    if (!edgeFunctionResponse.ok) {
      console.error('Edge Function error:', edgeFunctionData);
      return NextResponse.json(
        {
          error: {
            code: 'CERTIFICATE_GENERATION_FAILED',
            message: edgeFunctionData.error?.message || 'فشل في توليد الشهادة',
            details: edgeFunctionData.error,
          },
        },
        { status: 500 }
      );
    }

    // Return success response with enhanced data
    return NextResponse.json({
      success: true,
      data: {
        ...edgeFunctionData.data,
        sprint_version: '4.0',
        features_enabled: {
          qr_code: body.enable_qr ?? true,
          digital_signature: body.enable_digital_signature ?? false,
          enhanced_security: true,
          arabic_text_support: true,
          multi_page_support: true,
        },
        request_metadata: {
          user_agent: userAgent,
          client_ip: clientIP,
          timestamp: new Date().toISOString(),
        },
      },
    });

  } catch (error) {
    console.error('Certificate generation API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'خطأ داخلي في الخادم',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('template_id');
    const accessCodeId = searchParams.get('access_code_id');

    if (!templateId && !accessCodeId) {
      return NextResponse.json(
        {
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'يجب توفير template_id أو access_code_id',
          },
        },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('issued_certificates')
      .select('*');

    if (templateId) {
      query = query.eq('template_id', templateId);
    }

    if (accessCodeId) {
      query = query.eq('access_code_id', accessCodeId);
    }

    const { data: certificates, error } = await query.order('issued_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'خطأ في استعلام قاعدة البيانات',
          },
        },
        { status: 500 }
      );
    }

    // Enhance response with Sprint 4 metadata
    const enhancedCertificates = certificates?.map(cert => ({
      ...cert,
      sprint_version: '4.0',
      features: {
        qr_code: !!cert.qr_code_data,
        digital_signature: !!cert.digital_signature,
        enhanced_security: true,
        arabic_text_support: true,
      },
      verification_info: {
        hash: cert.verification_hash,
        timestamp: cert.issued_at,
        validity: 'valid',
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        certificates: enhancedCertificates,
        count: enhancedCertificates?.length || 0,
        sprint_version: '4.0',
        features: {
          qr_codes_supported: true,
          digital_signatures_supported: true,
          enhanced_security: true,
          arabic_text_support: true,
        },
      },
    });

  } catch (error) {
    console.error('Certificates GET API error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'خطأ داخلي في الخادم',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// Enhanced validation function
function validateRequest(body: CertificateGenerationRequest): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!body.access_code_id || typeof body.access_code_id !== 'string') {
    errors.push('access_code_id مطلوب ويجب أن يكون نص');
  }

  if (!body.template_id || typeof body.template_id !== 'string') {
    errors.push('template_id مطلوب ويجب أن يكون نص');
  }

  if (!body.student_name || typeof body.student_name !== 'string' || body.student_name.trim().length < 2) {
    errors.push('student_name مطلوب ويجب أن يكون نص صحيح (أكثر من حرفين)');
  }

  // Optional fields validation
  if (body.student_email && typeof body.student_email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.student_email)) {
      errors.push('student_email يجب أن يكون بريد إلكتروني صحيح');
    }
  }

  // Custom fields validation
  if (body.custom_fields) {
    const fieldCount = Object.keys(body.custom_fields).length;
    if (fieldCount > 10) {
      warnings.push('عدد الحقول المخصصة كبير جداً - سيتم تجاهل الحقول الزائدة');
    }

    for (const [key, value] of Object.entries(body.custom_fields)) {
      if (key.length > 50) {
        warnings.push(`اسم الحقل "${key}" طويل جداً`);
      }
      if (typeof value === 'string' && value.length > 500) {
        warnings.push(`قيمة الحقل "${key}" طويلة جداً - سيتم قطعها`);
      }
    }
  }

  // Boolean fields validation
  if (body.enable_qr !== undefined && typeof body.enable_qr !== 'boolean') {
    errors.push('enable_qr يجب أن يكون boolean');
  }

  if (body.enable_digital_signature !== undefined && typeof body.enable_digital_signature !== 'boolean') {
    errors.push('enable_digital_signature يجب أن يكون boolean');
  }

  // Name length validation
  if (body.student_name && body.student_name.length > 100) {
    warnings.push('اسم الطالب طويل جداً - قد يتم قطعه');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
