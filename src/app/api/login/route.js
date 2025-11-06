import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from "@/src/app/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, remember } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.hash_password);

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id_user: user.id_user,
        email: user.email,
        nickname: user.nickname
      },
      process.env.JWT_SECRET,
      { expiresIn: remember ? '7d' : '1d' }
    );

    // Cookie options
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        user: {
          id_user: user.id_user,
          email: user.email,
          nickname: user.nickname
        }
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24 // 7 hari vs 1 hari
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
