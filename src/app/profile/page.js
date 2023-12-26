"use client"; // Add this line at the beginning to mark the parent component as a client component

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { useProfile } from "@/components/UseProfile";

import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";

export default function Profile() {
  const session = useSession();
  const { status } = session;
  const [user, setUser] = useState(null)
  const { loading: fetchingData, data: userData } = useProfile();

  const getProfileData = () => {
    fetch("/api/profile", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`HTTP error! Status: ${res.status}`);
          setUser(null);
          return;
        }

        res
          .json()
          .then((json) => {
            const user = json.user;
            setUser(user);
          })
          .catch((error) => {
            // Handle JSON parsing error
            console.error("Error parsing JSON:", error);
            // Optionally, handle the error or set user to a default value
            setUser(null);
          });
      })
      .catch((error) => {
        // Handle fetch error (e.g., network error)
        console.error("Fetch error:", error);
        // Optionally, handle the error or set user to a default value
        setUser(null);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      getProfileData();
    }
  }, [session, status]);

  if (status === "loading" || fetchingData) {
    return (
      <div className="text-center text-primary text-4xl mb-4">Loading.....</div>
    );
  } else if (status === "unauthenticated") {
    window.location.href = "/login";
    return null;
  }

  const handleProfileInfoUpdate = async (e, data) => {
    e.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/profile/", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          resolve();
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(savingPromise, {
      loading: "Updating...",
      success: "Updated successfully",
      error: "Something went wrong",
    });
  };

  const handleProfilePhotoUpdate = async (e) => {
    const files = e.target.files;
    if (files?.length > 0) {
      const data = new FormData();
      data.set("file", files[0]);

      const uploadPromise = new Promise(async (resolve, reject) => {
        const res = await fetch("/api/profileImage", {
          method: "POST",
          body: data,
        });
        if (res.ok) {
          const json = await res.json();
          setUserImage("");
          console.log(json.link);
          setUserImage(json.link);
          resolve();
          getProfileData();
        }
        reject();
      });

      await toast.promise(uploadPromise, {
        loading: "Uploading...",
        success: "Upload complete",
        error: "Upload error",
      });
    }
  };

  return (
    <section className="mt-8">
      <UserTabs isAdmin={userData?.admin} />
      <div className="max-w-md mx-auto mt-8">
        {user && <UserForm user={user} onSave={handleProfileInfoUpdate} />}
      </div>
    </section>
  );
}
