import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "@/models/User";


export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: {  label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {

          await mongoose.connect(process.env.MONGODB_URL)
          const { email, password } = credentials;

          const user = await User.findOne({ email });

          if (user && bcrypt.compareSync(password, user.password)) {
            console.log("Authentication successful");
            return Promise.resolve({ id: user._id.toString(), ...user });
          } else {
            console.log("Invalid credentials");
            return Promise.resolve(null);
          }
        } catch (error) {
          console.error("Error during authentication:", error);
          return Promise.resolve(null);
        }
      },
    }),
  ],
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };