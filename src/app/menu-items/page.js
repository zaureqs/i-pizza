"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";

export default function MenuItemsPage() {
  const session = useSession();
  const { status } = session;
  const [menuItems, setMenuItems] = useState([]);
  const { loading: fetchingData, data: userData } = useProfile();

  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((menuItems) => {
        setMenuItems(menuItems.data);
      });
    });
  }, []);

  if (status === "loading" || fetchingData) {
    return (
      <div className="text-center text-primary text-4xl mb-4">Loading.....</div>
    );
  } else if (status === "unauthenticated") {
    window.location.href = "/login";
    return null;
  } else if (!userData?.admin) {
    return (
      <div className="text-center text-primary text-4xl mb-4 mt-8">
        You are not admin
      </div>
    );
  }

  return (
    <section className="mt-8 max-w-lg mx-auto min-h-screen">
      <UserTabs isAdmin={userData?.admin} />
      <div className="mt-8">
        <Link className="button flex" href={"/menu-items/new"}>
          <span>Crete new menu item</span> <Right />
        </Link>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu items:</h2>
        <div className="grid grid-cols-3 gap-2">
          {menuItems.length > 0 &&
            menuItems.map((item) => (
              <Link
                key={item._id}
                href={"menu-items/edit/" + item._id}
                className="bg-gray-300 rounded-lg p-4"
              >
                <div className="relative">
                  <Image
                    className="rounded-md"
                    src={item.image}
                    alt={"item image"}
                    width={150}
                    height={150}
                  />
                </div>
                <div className="text-center">{item.name}</div>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
