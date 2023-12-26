"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile";

export default function MenuItemsPage() {
  const session = useSession();
  const { status } = session;

  if (status === "loading") {
    return (
      <div className="text-center text-primary text-4xl mb-4">Loading.....</div>
    );
  } else if (status === "unauthenticated") {
    window.location.href = "/login";
  } else {
    window.location.href = "/menu-items";
  }

  return (
    <>
    </>
  );
}
