import { NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';

async function runOCR(buffer) {
  // Path manualmu saya pertahankan
  const worker = await createWorker('eng+ind', 1, {
    workerPath: "./node_modules/tesseract.js/src/worker-script/node/index.js"
  });

  const ret = await worker.recognize(buffer);
  await worker.terminate();
  return ret.data.text; // Ini adalah Teks Berantakan
}

async function structureTextWithGenAI(rawText) {
  // Pastikan kamu sudah taruh ini di .env.local
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY belum di-set di .env.local");
  }

  // "Mantra" untuk Groq
  const systemPrompt = `Kamu adalah asisten parser nota keuangan yang sangat akurat.
Anda akan menerima teks mentah hasil OCR dari sebuah nota.
Tugasmu adalah mengekstrak informasi berikut dan mengembalikannya HANYA dalam format JSON yang valid.
Jangan tambahkan teks penjelasan apa pun sebelum atau sesudah blok JSON.

Format JSON yang diinginkan:
{
  "merchant": "NAMA_TOKO",
  "total": ANGKA_TOTAL_HARGA,
  "items": [
    { "name": "NAMA_BARANG_1", "price": HARGA_BARANG_1 }
  ],
  "category_suggestion": "SUGESTI_KATEGORI_SINGKAT"
}

Jika ada informasi yang tidak ditemukan, isi dengan null atau array kosong.
Pastikan 'total' dan 'price' adalah tipe angka (Number), bukan string.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Berikut adalah teks mentah hasil OCR:\n\n${rawText}` }
        ],
        temperature: 0.1, // Supaya outputnya konsisten
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Groq API Error:", errorBody);
      throw new Error(`Groq API merespon dengan status ${response.status}`);
    }

    const data = await response.json();
    const jsonString = data.choices[0].message.content;

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error saat memanggil Groq:", error);
    throw new Error("Gagal menstrukturkan data dengan Groq.");
  }
}

export async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ error: "Nggak ada file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const rawText = await runOCR(buffer);
    const structuredJson = await structureTextWithGenAI(rawText);
    return NextResponse.json({
      ...structuredJson,
      raw_text: rawText
    });

  } catch (error) {
    console.error("Error di API route:", error);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}