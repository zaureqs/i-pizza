"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { useProfile } from "@/components/UseProfile";

import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";

export default function UsersPage() {
  const session = useSession();
  const { status } = session;
  const { loading: fetchingData, data: userData } = useProfile();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("api/users").then((res) => {
      res.json().then((data) => {
        setUsers(data.users);
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
    <section className="mt-8 max-w-2xl mx-auto min-h-screen">
      <UserTabs isAdmin={userData?.admin} />
      <div className="mt-8">
        {users?.length > 0 &&
          users.map((user) => (
            <div
              key={user._id}
              className="flex flex-col bg-gray-100 rounded-lg mb-2 p-1 px-4 items-center gap-4 md:flex-row"
            >
              <div className="grid md:grid-cols-2 grow">
                <div className="text-gray-800 font-semibold">
                  {user?.name ? (
                    <span>{user.name}</span>
                  ) : (
                    <span className="italic">No name</span>
                  )}
                </div>
                <span className="text-gray-500">{user.email}</span>
              </div>
              <div>
                <Link href={'/users/'+user._id} className="button">Edit</Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
