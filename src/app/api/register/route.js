import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from "@/src/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nickname, email, password } = body;

    // VALIDASI INPUT
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: 'Email, password, dan nama pengguna wajib diisi' },
        { status: 400 }
      );
    }

    if (nickname.trim().length < 3) {
      return NextResponse.json({ error: "Nama minimal 3 karakter" }, { status: 400 });
    }

    if (nickname.length > 50) {
      return NextResponse.json({ error: "Nama maks 50 karakter" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email tidak valid" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    // CEK EMAIL SUDAH ADA
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // HASH PASSWORD
    const hashPassword = await bcrypt.hash(password, 10);

    // SIMPAN USER BARU
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        nickname: nickname.trim(),
        hash_password: hashPassword
      },
      select: { id_user: true, email: true, nickname: true }
    });

    // === GENERATE JWT TOKEN ===
    const token = jwt.sign(
      {
        id_user: newUser.id_user,
        email: newUser.email,
        nickname: newUser.nickname
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // === BUAT RESPONSE DENGAN COOKIE ===
    const response = NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil",
        user: newUser
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;

  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
