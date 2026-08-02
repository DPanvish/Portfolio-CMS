import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PUBLIC: Accept incoming messages from frontend portfolios
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMessage = await Message.create({
      name: body.name,
      email: body.email,
      message: body.message,
      portfolioSource: body.portfolioSource || "unknown",
    });
    
    return NextResponse.json({ success: true, id: newMessage._id }, { status: 201 });
    
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// SECURE: Fetch all messages (Only you can do this)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    // Fetch messages, newest first
    const messages = await Message.find().sort({ createdAt: -1 });
    
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}