// src/pages/tasks/[taskId].tsx

import { useRouter } from "next/router";
import React from "react";
import KanbanCard from "@/app/components/KanbanBoard/KanbanCard"; // Ensure this path is correct
import { GetServerSidePropsContext } from "next";
import prisma from "@/lib/prisma"; // Ensure the Prisma instance is imported correctly

// Define the type for the task
type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string; // Use string if the date is serialized as a string
};

// Define the props for the TaskPage component
type TaskPageProps = {
  task: Task;
};

const TaskPage: React.FC<TaskPageProps> = ({ task }) => {
  const router = useRouter();

  if (!task) {
    return <div className="text-center text-gray-500">Task not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 shadow-md rounded-lg">
      {/* KanbanCard Component */}
      <KanbanCard
        id={task.id.toString()}
        title={task.title}
        description={task.description}
        dueDate={new Date(task.dueDate).toLocaleDateString()}
        onDelete={() => router.push("/")} // Temporary onDelete action to navigate back
      />
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Kanban Board
      </button>
    </div>
  );
};

// Fetch task data on the server-side
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { taskId } = context.params!; // Non-null assertion since taskId is required

  try {
    const task = await prisma.card.findUnique({
      where: { id: parseInt(taskId as string) },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    if (!task) {
      return {
        notFound: true,
      };
    }

    return {
      props: { task },
    };
  } catch (error) {
    console.error("Error fetching task:", error);
    return {
      notFound: true,
    };
  }
}

export default TaskPage;
