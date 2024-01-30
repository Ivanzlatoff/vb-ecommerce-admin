import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";


// Define a schema for input validation
const userSchema = z
  .object({
    name: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters')
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = userSchema.parse(body);

    // check if email already exists
    const existingUserByEmail = await prismadb.user.findUnique({
      where: { email: email }
    });

    if(existingUserByEmail) {
      return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 })
    }

    // check if username already exists
    // const existingUserByUsername = await prismadb.user.findUnique({
    //   where: { username: username }
    // });

    // if(existingUserByUsername) {
    //   return NextResponse.json({ user: null, message: "User with this username already exists" }, { status: 409 })
    // }

    const hashedPassword = await hash(password, 10);
    const newUser = await prismadb.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });
  } catch(error) {
    return NextResponse.json({ message: "Something went wrong", error }, { status: 500 });
  }
}

export async function GET (req: Request) {
  const session = await auth();

  return NextResponse.json({ authenticated: !!session });
}