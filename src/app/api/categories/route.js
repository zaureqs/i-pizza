import { Category } from "@/models/Category";
import mongoose from "mongoose";

export async function POST(req) {
  const { name } = await req.json();
  mongoose.connect(process.env.MONGODB_URL);

  const newCategory = await Category.create({ name });


  return Response.json(true);
}

export async function GET(req) {
  mongoose.connect(process.env.MONGODB_URL);
  const categories = await Category.find();

  return Response.json({ success: true, categories });
}


export async function PUT(req) {
    const { _id, name } = await req.json();
    mongoose.connect(process.env.MONGODB_URL);
  
    const newCategory = await Category.updateOne({_id},{ name });
  
    return Response.json(true);
}


export async function DELETE(req) {
  mongoose.connect(process.env.MONGODB_URL);

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  const deleted = await Category.deleteOne({_id});

  return Response.json(true);
}