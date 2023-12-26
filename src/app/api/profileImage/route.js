import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "@/models/User";


const updatedb = async (link) => {

    await mongoose.connect(process.env.MONGODB_URL);
    const session = await getServerSession(authOptions);

    const email = session?.user?.email;
    console.log(email, link);
    const updatedUser = await User.updateOne({email}, {image: link});

    return {success: true};
}

export async function POST(req) {
    const data = await req.formData();
    
    const file = data.get('file');

    const s3Client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY,
            secretAccessKey: process.env.MY_AWS_SECRET_KEY,
        }
    });

    const ext = '.'+file.name.split('.').slice(-1)[0];
     
    const newFileName = uniqid(undefined, ext);
    
    const chunks = [];
    for await (const chunk of file.stream()){
        chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const bucket = process.env.AWS_BUCKET;
    s3Client.send(new PutObjectCommand({
        Bucket: bucket,
        Key: 'profile-pictures/'+newFileName,
        ACL: 'public-read',
        ContentType: file.type,
        Body: buffer,
    }))

    const link = `https://${bucket}.s3.amazonaws.com/profile-pictures/${newFileName}`

    const responce = await updatedb(link);

    if(responce.success){
        return Response.json({
        success: true,
        link
    });
    } else {
        return Response.json({
            success: false,
        });
    }
}