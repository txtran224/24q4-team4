import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

// Helper function for JSON responses
const response = (data: unknown, status: number = 200) =>
  NextResponse.json(data, { status });

// Interface for creating a card
interface CreateCardRequest {
  title: string;
  content?: string;
  boardId: number;
}

// Create a new card in a board
export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return response({ error: "Unauthorized" }, 401);
  }

  try {
    const body = (await request.json()) as CreateCardRequest;
    const { title, content, boardId } = body;

    if (!title || !boardId) {
      return response({ error: "Title and boardId are required" }, 400);
    }

    // Ensure the board belongs to the authenticated user
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId,
      },
    });

    if (!board) {
      return response({ error: "Board not found or unauthorized" }, 404);
    }

    // Create the new card
    const newCard = await prisma.card.create({
      data: {
        title,
        content,
        boardId, 
      },
    });

    return response({ success: true, data: newCard }, 201);
  } catch (error) {
    console.error("Error creating card:", error);
    return response({ error: "Failed to create card" }, 500);
  }
}

export async function DELETE(request: NextRequest) {
  const { userId } = await getAuth(request);
  const cardId = request.nextUrl.searchParams.get("id");

  if (!userId) {
    return response({ error: "Unauthorized" }, 401);
  }

  if (!cardId) {
    return response({ error: "Card ID is required" }, 400);
  }

  try {
    // Ensure the card belongs to the authenticated user via the board relation
    const card = await prisma.card.findFirst({
      where: {
        id: parseInt(cardId),
        board: {
          userId, // Verify ownership through the board
        },
      },
    });

    if (!card) {
      return response({ error: "Card not found or unauthorized" }, 404);
    }

    // Delete the card
    await prisma.card.delete({
      where: { id: card.id },
    });

    return response({ success: true, message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    return response({ error: "Failed to delete card" }, 500);
  }
}