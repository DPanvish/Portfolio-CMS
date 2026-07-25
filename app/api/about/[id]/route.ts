import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import About from "@/models/About";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await request.json();
    const {id} = await params;
    const updatedAbout = await About.findByIdAndUpdate(id, body, { new: true });
    
    return updatedAbout ? NextResponse.json(updatedAbout, { status: 200 }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const deletedAbout = await About.findByIdAndDelete(params.id);
    
    return deletedAbout ? NextResponse.json({ message: "Deleted" }, { status: 200 }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}