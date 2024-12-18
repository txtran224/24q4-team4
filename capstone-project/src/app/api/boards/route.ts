import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Helper function for JSON responses
const response = (data: unknown, status: number = 200) =>
  NextResponse.json(data, { status });


// Get all boards for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);

    console.log("Authenticated User ID:", userId);

    if (!userId) {
      console.warn("Unauthorized access attempt");
      return response({ success: false, error: "Unauthorized" }, 401);
    }

    const boards = await prisma.board.findMany({
      where: { userId },
    });

    console.log("Fetched Boards:", boards);
    return response({ success: true, data: boards });
  } catch (error) {
    console.error("Error fetching boards:", error);
    return response({ success: false, error: "Failed to fetch boards" }, 500);
  }
}

// Create a new board for the authenticated user
export async function POST(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, dueDate, boardId } = await request.json();

    if (!title || !boardId) {
      return NextResponse.json({ success: false, error: "Title and boardId are required" }, { status: 400 });
    }

    const newCard = await prisma.card.create({
      data: {
        title,
        content: description,
        boardId,
        createdAt: new Date(dueDate),
      },
    });

    return NextResponse.json({ success: true, data: newCard }, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json({ success: false, error: "Failed to create card" }, { status: 500 });
  }
}

// Delete a board by ID for the authenticated user
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);
    const boardId = request.nextUrl.searchParams.get("id");

    console.log("Authenticated User ID:", userId);
    console.log("Board ID to delete:", boardId);

    if (!userId) {
      console.warn("Unauthorized access attempt");
      return response({ success: false, error: "Unauthorized" }, 401);
    }

    if (!boardId) {
      return response({ success: false, error: "Board ID is required" }, 400);
    }

    const board = await prisma.board.findFirst({
      where: {
        id: parseInt(boardId),
        userId,
      },
    });

    if (!board) {
      return response({ success: false, error: "Board not found or you do not have permission to delete it" }, 404);
    }

    await prisma.board.delete({
      where: { id: board.id },
    });

    console.log("Deleted Board ID:", board.id);
    return response({ success: true, message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error deleting board:", error);
    return response({ success: false, error: "Failed to delete board" }, 500);
  }
}

// Update a board for the authenticated user
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return response({ success: false, error: "Unauthorized" }, 401);
    }

    const boardId = request.nextUrl.searchParams.get("id");
    const body = await request.json();
    const { title } = body;

    if (!boardId) {
      return response({ success: false, error: "Board ID is required" }, 400);
    }

    if (!title) {
      return response({ success: false, error: "Title is required" }, 400);
    }

    const board = await prisma.board.findFirst({
      where: {
        id: parseInt(boardId),
        userId,
      },
    });

    if (!board) {
      return response({ success: false, error: "Board not found or you do not have permission to update it" }, 404);
    }

    const updatedBoard = await prisma.board.update({
      where: { id: parseInt(boardId) },
      data: { title },
    });

    return response({ success: true, data: updatedBoard });
  } catch (error) {
    console.error("Error updating board:", error);
    return response({ success: false, error: "Failed to update board" }, 500);
  }
}