import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { UserInfo } from "@/models/UserInfo";
import { MenuItem } from "@/models/MenuItem";

export async function POST(req) {
  const data = await req.json();

  await mongoose.connect(process.env.MONGODB_URL);
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  const userInfo = await UserInfo.findOne({ email }).lean();

  if (!userInfo.admin) {
    return Response.json({
      success: true,
      message: "you are not admin",
    });
  }

  const menuItemDoc = await MenuItem.create(data);
  return Response.json({
    success: true,
    data: menuItemDoc,
  });
}

export async function PUT(req) {
  const { _id, ...data } = await req.json();

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

  const menuItemDoc = await MenuItem.updateOne({ _id }, data);

  return Response.json({
    success: true,
    data: menuItemDoc,
  });
}

export async function GET(req) {
  mongoose.connect(process.env.MONGODB_URL);
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  const menuItems = await MenuItem.find();
  return Response.json({
    success: true,
    data: menuItems,
  });
}

export async function DELETE(req) {
  await mongoose.connect(process.env.MONGODB_URL);
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  const userInfo = await UserInfo.findOne({ email }).lean();

  if (!userInfo.admin) {
    return Response.json({
      success: true,
      message: "you are not admin",
    });
  }

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  const deleted = await MenuItem.deleteOne({ _id });

  return Response.json({
    success: true,
  });
}
