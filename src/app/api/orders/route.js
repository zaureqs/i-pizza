import { UserInfo } from "@/models/UserInfo";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Order } from "@/models/Order";

export async function GET(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    let isAdmin = false;

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if (userEmail) {
      const userInfo = await UserInfo.findOne({ email: userEmail });
      if (userInfo) isAdmin = userInfo.admin;
    }

    if (isAdmin) {
      if (_id) {
        const OrderInfo = await Order.findOne({ _id });
        return Response.json(OrderInfo);
      }
      const OrderInfo = await Order.find();
      return Response.json(OrderInfo);
    }

    if (userEmail) {
      if (_id) {
        const OrderInfo = await Order.findOne({ _id, userEmail });
        console.log(OrderInfo);
        return Response.json(OrderInfo);
      }
      const OrderInfo = await Order.find({ userEmail });
      return Response.json(OrderInfo);
    }
  } catch (error) {
    console.error("Error in GET function:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
