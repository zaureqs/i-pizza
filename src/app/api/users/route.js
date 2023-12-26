import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { UserInfo } from "@/models/UserInfo";
import { User } from "@/models/User";


export async function GET(req) {
    mongoose.connect(process.env.MONGODB_URL);
    const session = await getServerSession(authOptions);
  
    const email = session?.user?.email;
  
    const userInfo = await UserInfo.findOne({ email }).lean();
  
    if (!userInfo.admin) {
      return Response.json({
        success: true,
        message: "you are not admin",
      });
    }
  
    const users = await User.find();
    return Response.json({
      success: true,
      users,
    });
  }