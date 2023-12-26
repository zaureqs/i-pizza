"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";


import { useProfile } from "@/components/UseProfile";


import DeleteButton from "@/components/layout/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";


export default function Categories() {
  const session = useSession();
  const { status } = session;
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);
  const { loading: fetchingData, data: userData } = useProfile();

  function fetchCategories() {
    fetch("/api/categories", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const creationPromise = new Promise(async (resolve, reject) => {
      const data = { name: categoryName };
      if (editedCategory) {
        data._id = editedCategory._id;
      }
      const res = await fetch("/api/categories", {
        method: editedCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setCategoryName("");
      fetchCategories();
      setEditedCategory(null);
      res.ok ? resolve() : reject();
    });

    await toast.promise(creationPromise, {
      loading: editedCategory
        ? "Updating category..."
        : "Creating your new category...",
      success: editedCategory ? "Category updated" : "Category created",
      error: "Error, sorry...",
    });
  };

  const handleDeleCategory = async (id) => {
    const deletePromise = new Promise(async (resolve, reject) => {
      const res = await fetch("/api/categories?_id=" + id, {
        method: "DELETE",
      });
      fetchCategories();
      res.ok ? resolve() : reject();
    });
    await toast.promise(deletePromise, {
      loading:  "Deleting...",
      success: "Deleted",
      error: "something went wrong",
    });
  };

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
    <section className="mt-8 max-w-lg mx-auto">
      <UserTabs isAdmin={userData?.admin} />
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? "Update category" : "New category name"}
              {editedCategory && (
                <>
                  : <b>{editedCategory.name}</b>
                </>
              )}
            </label>
            <input
              type="text"
              placeholder="category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedCategory ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Categories </h2>
        {categories &&
          categories.map((category) => (
            <div
              className="bg-gray-100 rounded-xl p-2 px-4 flex gap-2 mb-1 items-center"
              key={category._id}
            >
              <div
                className="grow hover:underline cursor-pointer"
                onClick={() => {
                  setEditedCategory(category);
                  setCategoryName(category.name);
                }}
              >
                {category.name}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(category);
                    setCategoryName(category.name);
                  }}
                >
                  Edit
                </button>
                <DeleteButton
                  onDelete={() => handleDeleCategory(category._id)}
                  label={'Delete'}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
