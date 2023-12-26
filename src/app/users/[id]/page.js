"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useProfile } from "@/components/UseProfile";

import UserTabs from "@/components/layout/UserTabs";
import UserForm from "@/components/layout/UserForm";

export default function EditUserPage() {
  const session = useSession();
  const { status } = session;
  const { loading: fetchingData, data: userData } = useProfile();

  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    console.log(id);

    fetch("/api/profile?_id=" + id)
      .then((res) => {
        if (!res.ok) {
          console.Error(`HTTP error! Status: ${res.status}`);
          return;
        } else {
          res.json().then((json) => {
            const user = json.user;
            setUser(user);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [id]);

  async function handleSaveButtonClick(e, data) {
    e.preventDefault();
    data._id = id;
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) resolve();
      else reject();
    });

    await toast.promise(promise, {
      loading: "Saving user...",
      success: "User saved",
      error: "An error has occurred while saving the user",
    });
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
    <section className="mt-8 max-w-2xl mx-auto min-h-screen">
      <UserTabs isAdmin={userData?.admin} />
      <div className="mt-8">
        {user ? (
          <UserForm user={user} onSave={handleSaveButtonClick} />
        ) : (
          <div className="text-center text-primary text-4xl mb-4 mt-8">
            Data not found
          </div>
        )}
      </div>
    </section>
  );
}
