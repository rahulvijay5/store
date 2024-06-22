import { NextRequest, NextResponse } from "next/server";
import {cleanup, prun} from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function POST(req:NextRequest){
    const requestbody = await req.json()
    const {businessName,address,phone,email,nameOfUser,clerkId} = requestbody;

    const userDetails = await prun.user.findFirst({
        where:{
            email:email
        }
    })
    if(userDetails){
        return new NextResponse(JSON.stringify({
            message: userDetails.id,
            status:200
        }))
    }
    await prun.user.create({
        data:{
            email:email,
            name:nameOfUser,
            clerkId: clerkId,
            phoneNumber: phone,
            address: address,
            businessName: businessName
        }
    })
    try {
        return new NextResponse(JSON.stringify({
            message: `User added successfully.`
        }), { status: 200 });
        
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error. Failed to Add User.' }), { status: 500 });
    } finally {
        await cleanup();
        // redirect("/")
    }


    return NextResponse.json({status:200})
}