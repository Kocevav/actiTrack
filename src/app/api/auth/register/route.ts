import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { signUpSchema } from "@/lib/zod";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, firstName, lastName, password, startDate } = parsed.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        dateOfBirth: startDate?.toISOString() ?? null,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
