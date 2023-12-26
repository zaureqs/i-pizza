import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req) {
  const data = await req.formData();

  const file = data.get("file");

  const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  const ext = "." + file.name.split(".").slice(-1)[0];

  const newFileName = uniqid(undefined, ext);

  const chunks = [];
  for await (const chunk of file.stream()) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  const bucket = process.env.AWS_BUCKET;
  s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: "menu-items/" + newFileName,
      ACL: "public-read",
      ContentType: file.type,
      Body: buffer,
    })
  );

  const link = `https://${bucket}.s3.amazonaws.com/menu-items/${newFileName}`;

  return Response.json({
    success: true,
    link,
  });
}
