// src/app/pages/Board/page.tsx

"use client";

import { Suspense } from "react";
import Link from "next/link";
import KanbanBoard from "../../components/KanbanBoard/KanbanBoard";
import { useSearchParams } from "next/navigation";

const KanbanPageContent = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("q") || "Untitled Board";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-500 via-blue-600 to-purple-600 dark:from-gray-900 dark:via-gray-800 dark:to-purple-800 p-10">
      {/* Return Home Header */}
      <header className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="text-lg font-semibold text-white bg-teal-600 dark:bg-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 dark:hover:bg-gray-600 transition-all"
        >
          &larr; Return Home
        </Link>
        <h1 className="text-4xl font-extrabold text-white text-center">
          {title}
        </h1>
      </header>

      {/* Kanban Board */}
      <main>
        <KanbanBoard id="kanban-board" title={title} />
      </main>
    </div>
  );
};

const KanbanPage = () => (
  <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
    <KanbanPageContent />
  </Suspense>
);

export default KanbanPage;
