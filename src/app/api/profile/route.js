import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";

export async function PUT(req) {
  mongoose.connect(process.env.MONGODB_URL);
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  const userInfo = await UserInfo.findOne({ email }).lean();

  const data = await req.json();
  const { _id, name, image, ...userData } = data;


  if (_id) {
    if (!userInfo.admin) {
      return Response.json({
        success: false,
        message: "you are not admin",
      });
    }
    const user = await User.findOneAndUpdate(
      { _id },
      { name, image: image }
    ).lean();
    const email = user.email;
    await UserInfo.updateOne({ email }, userData, { upsert: true });
    return Response.json(true);
  }

  await User.updateOne({ email }, { name, image });

  await UserInfo.updateOne({ email }, userData, { upsert: true });

  return Response.json(true);
}

export async function GET(req) {
  await mongoose.connect(process.env.MONGODB_URL);
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  const userInfo = await UserInfo.findOne({ email }).lean();

  if (_id && !userInfo.admin) {
    return Response.json({
      success: true,
      message: "you are not admin",
    });
  }

  if (_id) {
    const user = await User.findOne({ _id }).lean();
    const email = user.email;
    const userInfo = await UserInfo.findOne({ email }).lean();
    return Response.json({
      success: true,
      user: { ...user, ...userInfo },
    });
  }

  const user = await User.findOne({ email }).lean();

  return Response.json({
    success: true,
    user: { ...user, ...userInfo },
  });
}
