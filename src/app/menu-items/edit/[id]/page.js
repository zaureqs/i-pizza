"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { useProfile } from "@/components/UseProfile";

import UserTabs from "@/components/layout/UserTabs";
import Left from "@/components/icons/Left";
import { useParams } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";
import DeleteButton from "@/components/layout/DeleteButton";

export default function MenuItemsPage() {
  const session = useSession();
  const { status } = session;

  const { id } = useParams();
  const { loading: fetchingData, data: userData } = useProfile();

  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    fetch("/api/menu-items").then((res) => {
      res.json().then((data) => {
        const items = data.data;
        const item = items.find((i) => i._id === id);
        setMenuItem(item);
      });
    });
  }, [id]);

  const handleFormSubmit = async (e, data) => {
    e.preventDefault();
    data._id = id;
    console.log(data);
    const savingPromise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/menu-items", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      res.ok ? resolve() : reject();
    });

    toast.promise(savingPromise, {
      loading: "Saving item....",
      success: "saved successfully",
      error: "something went wrong",
    });

    window.location.href = "/menu-items/";
  };


  const deleteItem = async () => {
    const deletePromise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/menu-items?_id=" + id, {
        method: "DELETE",
      });
      res.ok ? resolve() : reject();
    });
    await toast.promise(deletePromise, {
      loading:  "Deleting...",
      success: "Deleted",
      error: "something went wrong",
    });
    window.location.href = "/menu-items/";
  }

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
        <Link className="button flex" href={"/menu-items"}>
          <Left /> <span>Go back to all items</span>
        </Link>
      </div>
      <MenuItemForm 
      onSubmit={handleFormSubmit}
      menuItem={menuItem}
      />
      <div className="max-w-lg mx-auto mt-4 rounded-lg">
          <DeleteButton
          label={'Delete Item'}
          onDelete={deleteItem}
           />
      </div>

      
    </section>
  );
}
