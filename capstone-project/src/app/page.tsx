"use client";

import React from "react";
import { SignedOut } from "@clerk/nextjs";
import HomePage from "./components/HomePage";

const Page: React.FC = () => {
  return (
    <div>
      <SignedOut>
        <HomePage />
      </SignedOut>
    </div>
  );
};

export default Page;
