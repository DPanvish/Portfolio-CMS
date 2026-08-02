import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Message from "@/models/Message";

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