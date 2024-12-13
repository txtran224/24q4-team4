"use client";

import React from "react";
import { SignedOut } from "@clerk/nextjs";
import HomePage from "./components/HomePage";

const Page: React.FC = () => {
  return (
    <div>
      <HomePage />
    </div>
  );
};

export default Page;
