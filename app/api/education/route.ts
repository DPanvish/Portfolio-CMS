import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Education from "@/models/Education";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const portfolioTarget = searchParams.get("portfolio");

    const query = portfolioTarget ? { portfolios: { $in: ["all", portfolioTarget] } } : {};
    const education = await Education.find(query).sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json(education, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const body = await request.json();
    const newEdu = await Education.create(body);
    
    return NextResponse.json(newEdu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}