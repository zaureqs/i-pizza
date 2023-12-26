"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [creatingUser, setCreatingUser] = useState(false);
  const [userCreated, setUserCreated] = useState(false);

  async function handleFormSubmit(e) {
    e.preventDefault();
    setCreatingUser(true);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({name, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    console.log(res.status);
    if (res.status === 200) {
      setUserCreated(true);
    }
    setCreatingUser(false);
  }

  return (
    <section className="mt-8">
      <h1 className="text-primary text-center text-4xl mb-4">Register</h1>
      {userCreated && (
        <div className="my-4 text-center">
          user created. <br />
          Now you can{" "}
          <Link className="underline" href={"/login"}>
            Login &raquo;
          </Link>
        </div>
      )}
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
      <input
          type="text"
          id="name"
          name="name"
          placeholder="abc"
          autoComplete="off"
          disabled={creatingUser}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="abc@example.com"
          autoComplete="off"
          disabled={creatingUser}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password@123"
          autoComplete="off"
          disabled={creatingUser}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={creatingUser}>
          Register
        </button>
        <div className="my-4 text-center text-gray-500">Login with :</div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex gap-4 justify-center items-center"
        >
          <Image src={"/google.png"} alt="img" width={24} height={24} />
          google
        </button>
      </form>
    </section>
  );
}
