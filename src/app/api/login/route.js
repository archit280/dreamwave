import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function POST(req) {
  try {
    const body = await req.json();
console.log(body);

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
        console.log("user not found");
        
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }
const isMatch = await bcrypt.compare(body.password, user.password)
    // 2. Compare password (plain text match)
    if (!isMatch) {
        console.log("login failed");
        
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    // 3. Create JWT token body
    const tokenBody = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // 4. Sign JWT token
    const token = jwt.sign(tokenBody, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 5. Send role + set cookie
    const res = NextResponse.json(
      { Role: user.role },
      { status: 200 }
    );

    res.cookies.set(
      "mylogintoken",
      JSON.stringify({
        token,
        role: user.role,
      }),
      {
        httpOnly: false,
        path: "/",
      }
    );

    return res;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
