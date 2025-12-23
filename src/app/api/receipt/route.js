import { NextResponse } from 'next/server';
import { supabase } from '@/src/app/lib/supabaseClient';
import { getUserFromToken } from '@/src/app/lib/auth';

// GET /api/receipt - Fetch all receipts for current user
export async function GET() {
    try {
        const user = await getUserFromToken();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Query receipts with transaction details using Supabase
        const { data, error } = await supabase
            .from('nota')
            .select(`
        id_nota,
        foto_nota,
        detail_nota,
        timestamp,
        transaksi:id_transaksi (
          id_transaksi,
          detail_transaksi,
          nominal,
          timestamp,
          jenis_transaksi:id_jenis (
            id_jenis,
            jenis
          ),
          kategori:id_kategori (
            id_kategori,
            nama_kategori
          )
        )
      `)
            .eq('transaksi.id_user', user.id_user)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Supabase query error:', error);
            return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 });
        }

        return NextResponse.json({ receipts: data || [] });
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

        // 3. Create transaction record
        const detailTransaksi = judul || merchant || 'Transaksi dari nota';
        const timestampTransaksi = tanggal ? new Date(tanggal).toISOString() : new Date().toISOString();

        const { data: transaksiData, error: transaksiError } = await supabase
            .from('transaksi')
            .insert({
                id_user: user.id_user,
                detail_transaksi: detailTransaksi,
                id_jenis: idJenis,
                id_kategori: idKategori,
                nominal: total,
                timestamp: timestampTransaksi
            })
            .select()
            .single();

        if (transaksiError) {
            console.error('Transaction insert error:', transaksiError);
            // Cleanup: delete uploaded image
            await supabase.storage.from('nota-bucket').remove([fileName]);
            return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
        }

        // 4. Create receipt record
        const detailNota = rawText || catatan || '';

        const { data: notaData, error: notaError } = await supabase
            .from('nota')
            .insert({
                id_transaksi: transaksiData.id_transaksi,
                foto_nota: publicUrl,
                detail_nota: detailNota,
                timestamp: new Date().toISOString()
            })
            .select()
            .single();

        if (notaError) {
            console.error('Receipt insert error:', notaError);
            // Cleanup: delete transaction and image
            await supabase.from('transaksi').delete().eq('id_transaksi', transaksiData.id_transaksi);
            await supabase.storage.from('nota-bucket').remove([fileName]);
            return NextResponse.json({ error: 'Failed to create receipt' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Receipt saved successfully',
            data: {
                id_transaksi: transaksiData.id_transaksi,
                id_nota: notaData.id_nota,
                foto_nota: publicUrl
            }
        }, { status: 201 });

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

        // 1. Get receipt details to verify ownership and get file path
        const { data: notaData, error: notaFetchError } = await supabase
            .from('nota')
            .select(`
        id_nota,
        foto_nota,
        id_transaksi,
        transaksi:id_transaksi (
          id_user
        )
      `)
            .eq('id_nota', idNota)
            .single();

        if (notaFetchError || !notaData) {
            return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
        }

        // Verify ownership
        if (notaData.transaksi.id_user !== user.id_user) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Extract file path from URL
        const urlParts = notaData.foto_nota.split('/nota-bucket/');
        const filePath = urlParts.length > 1 ? urlParts[1] : null;

        // 3. Delete transaction (will cascade delete receipt due to FK constraint)
        const { error: deleteError } = await supabase
            .from('transaksi')
            .delete()
            .eq('id_transaksi', notaData.id_transaksi);

        if (deleteError) {
            console.error('Delete transaction error:', deleteError);
            return NextResponse.json({ error: 'Failed to delete receipt' }, { status: 500 });
        }

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