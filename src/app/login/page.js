"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [processLogin, setProcessLogin] = useState(false);
  const [userLogedin, setUserLogedin] = useState(false);

  async function handleFormSubmit(e) {
    e.preventDefault();
    setProcessLogin(true);
    const res = await signIn("credentials", { email, password, callbackUrl: '/'});
    console.log(res);
  }

  return (
    <section className="mt-8">
      <h1 className="text-primary text-center text-4xl mb-4">Login</h1>
      <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="abc@example.com"
          autoComplete="off"
          disabled={processLogin}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password@123"
          autoComplete="off"
          disabled={processLogin}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={processLogin}>
          Login
        </button>
      </form>
      <div className="my-4 text-center text-gray-500">Login with :</div>
      <button
      onClick={() => signIn('google', {callbackUrl: '/'})}
       className="flex gap-4 max-w-xs mx-auto justify-center items-center">
        <Image src={"/google.png"} alt="img" width={24} height={24} />
        google
      </button>
    </section>
  );
}
