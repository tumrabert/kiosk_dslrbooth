import { NextResponse } from 'next/server'
import {connectMongoDB} from '@kiosk-dev/lib/mongodb'
import User from '@kiosk-dev/models/user'
import bcrypt from 'bcryptjs'
export async function POST(request) {
    try{
        const{username, password} = await request.json();
        //console.log("User: ", username, "Password: ", password);
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectMongoDB();
        await User.create({username:username, password: hashedPassword});   

        return NextResponse.json({ message: "User registered." }, { status: 201 })
    }
    catch(error){
        console.log("Error(reg): ", error)
        return NextResponse.json({ message: "An error occured while registering the user." }, { status: 500 })
    }
}