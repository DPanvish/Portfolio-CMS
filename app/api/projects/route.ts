import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";

// PUBLIC: Fetch all projects, allowing a 'portfolio' query parameter filter
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const portfolioTarget = searchParams.get("portfolio");

    let query = {};
    if (portfolioTarget) {
      query = { portfolios: { $in: ["all", portfolioTarget] } };
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// SECURE: Create a new project (Only you can do this)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await request.json();

    const newProject = await Project.create(body);
    
    return NextResponse.json(newProject, { status: 201 });
    
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}