import { NextResponse } from 'next/server';

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL;

export async function POST(request) {
  if (!OCR_SERVICE_URL) {
    return NextResponse.json(
      { error: 'OCR_SERVICE_URL not configured' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Forward the file to the OCR microservice
    const ocrFormData = new FormData();
    ocrFormData.append('file', file);

    const response = await fetch(`${OCR_SERVICE_URL}/ocr`, {
      method: 'POST',
      body: ocrFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'OCR service error' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error calling OCR service:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}