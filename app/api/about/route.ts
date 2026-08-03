import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import About from "@/models/About";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const about = await About.findOne().sort({ createdAt: -1 }); 
    
    return NextResponse.json(about || {}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await request.json();
    
    // Remove empty _id to prevent Mongoose CastError
    if (!body._id) {
      delete body._id;
    }

    const newAbout = await About.create(body);
    
    return NextResponse.json(newAbout, { status: 201 });
  } catch (error) {
    console.error("POST /api/about error:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}