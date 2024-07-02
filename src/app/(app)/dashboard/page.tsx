"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { Button } from "@components/ui/button";

const Dashboard = () => {
  return (
    <div>
      You are logged in
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};

export default Dashboard;
