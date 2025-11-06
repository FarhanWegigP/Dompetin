// app/api/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/app/lib/prisma';;

export async function POST(request) {
  try {
    // 1. Ambil data dari request body
    const body = await request.json();
    const { nickname, email, password } = body;

    // 2. Validasi input
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: 'Email, password, dan nama pengguna wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi nickname
    if (nickname.trim().length < 3) {
      return NextResponse.json(
        { error: 'Nama pengguna minimal 3 karakter' },
        { status: 400 }
      );
    }

    if (nickname.length > 50) {
      return NextResponse.json(
        { error: 'Nama pengguna maksimal 50 karakter' },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Validasi panjang password
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // 3. Cek apakah user dengan email tersebut sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }

    // 4. Hash password menggunakan bcrypt
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // 5. Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        nickname: nickname.trim(),
        hash_password: hashPassword
      },
      select: {
        id_user: true,
        email: true,
        nickname: true
      }
    });

    // 6. Return respons sukses
    return NextResponse.json(
      {
        success: true,
        message: 'Registrasi berhasil',
        user: newUser
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}