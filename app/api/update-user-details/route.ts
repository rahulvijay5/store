import { NextRequest, NextResponse } from "next/server";
import {cleanup, prun} from "@/lib/prisma";

export async function POST(req:NextRequest){
    const requestbody = await req.json()
    const {userId,userName} = requestbody;

    const usernameExists = await prun.user.findUnique({
        where:{
            username:userName,
        },
    })
    if(usernameExists){
        return new NextResponse(JSON.stringify({
            message:"Username already exists!",
        }),{status:409})
    }
    await prun.user.update({
        where:{
            id:userId,
        },
        data:{
            username:userName
        }
    })
    try {
        return new NextResponse(JSON.stringify({
            message: userName
        }), { status: 200 });
        
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error. Failed to Add User.' }), { status: 500 });
    } finally {
        await cleanup();
    }
}