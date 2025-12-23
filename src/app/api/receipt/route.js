import { NextResponse } from 'next/server';
import { supabase } from '@/src/app/lib/supabaseClient';
import { prisma } from '@/src/app/lib/prisma';
import { getUserFromToken } from '@/src/app/lib/auth';

// GET /api/receipt - Fetch all receipts for current user
export async function GET() {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Query receipts with transaction details using Prisma
        const receipts = await prisma.nota.findMany({
            where: {
                transaksi: {
                    id_user: user.id_user
                }
            },
            include: {
                transaksi: {
                    include: {
                        jenis_transaksi: true,
                        kategori: true
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        return NextResponse.json({ receipts: receipts || [] });
    } catch (error) {
        console.error('GET /api/receipt error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/receipt - Save new receipt with transaction
export async function POST(request) {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file');
        const merchant = formData.get('merchant');
        const total = parseFloat(formData.get('total'));
        const itemsJson = formData.get('items');
        const categorySuggestion = formData.get('category_suggestion');
        const rawText = formData.get('raw_text');
        const tanggal = formData.get('tanggal');
        const catatan = formData.get('catatan');
        const judul = formData.get('judul');
        const idKategori = parseInt(formData.get('id_kategori'));
        const idJenis = parseInt(formData.get('id_jenis'));

        // Validations
        if (!file) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }
        if (!total || !idKategori || !idJenis) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Upload image to Supabase Storage
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id_user}/${timestamp}_${judul || 'receipt'}.${fileExt}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('nota-bucket')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }

        // 2. Get public URL of uploaded image
        const { data: { publicUrl } } = supabase.storage
            .from('nota-bucket')
            .getPublicUrl(fileName);

        // 3. Create transaction record using Prisma
        const detailTransaksi = judul || merchant || 'Transaksi dari nota';
        const timestampTransaksi = tanggal ? new Date(tanggal) : new Date();

        try {
            const transaksiData = await prisma.transaksi.create({
                data: {
                    id_user: user.id_user,
                    detail_transaksi: detailTransaksi,
                    id_jenis: idJenis,
                    id_kategori: idKategori,
                    nominal: total,
                    timestamp: timestampTransaksi
                }
            });

            // 4. Create receipt record using Prisma
            const detailNota = rawText || catatan || '';

            const notaData = await prisma.nota.create({
                data: {
                    id_transaksi: transaksiData.id_transaksi,
                    foto_nota: publicUrl,
                    detail_nota: detailNota,
                    timestamp: new Date()
                }
            });

            return NextResponse.json({
                success: true,
                message: 'Receipt saved successfully',
                data: {
                    id_transaksi: transaksiData.id_transaksi,
                    id_nota: notaData.id_nota,
                    foto_nota: publicUrl
                }
            }, { status: 201 });

        } catch (dbError) {
            console.error('Transaction insert error:', dbError);
            // Cleanup: delete uploaded image
            await supabase.storage.from('nota-bucket').remove([fileName]);
            return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
        }

    } catch (error) {
        console.error('POST /api/receipt error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/receipt - Delete receipt and associated transaction
export async function DELETE(request) {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const idNota = parseInt(searchParams.get('id'));

        if (!idNota) {
            return NextResponse.json({ error: 'Receipt ID is required' }, { status: 400 });
        }

        // 1. Get receipt details to verify ownership and get file path using Prisma
        const notaData = await prisma.nota.findUnique({
            where: { id_nota: idNota },
            include: {
                transaksi: {
                    select: { id_user: true, id_transaksi: true }
                }
            }
        });

        if (!notaData) {
            return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
        }

        // Verify ownership
        if (notaData.transaksi.id_user !== user.id_user) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Extract file path from URL
        const urlParts = notaData.foto_nota.split('/nota-bucket/');
        const filePath = urlParts.length > 1 ? urlParts[1] : null;

        // 3. Delete transaction (will cascade delete receipt due to FK constraint) using Prisma
        await prisma.transaksi.delete({
            where: { id_transaksi: notaData.transaksi.id_transaksi }
        });

        // 4. Delete image from storage
        if (filePath) {
            const { error: storageError } = await supabase.storage
                .from('nota-bucket')
                .remove([filePath]);

            if (storageError) {
                console.error('Storage delete error:', storageError);
                // Don't fail the request if storage delete fails
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Receipt deleted successfully'
        });

    } catch (error) {
        console.error('DELETE /api/receipt error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}