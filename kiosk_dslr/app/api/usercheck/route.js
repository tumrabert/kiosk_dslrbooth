import {NextResponse} from 'next/server';
import {connectMongoDB} from '@kiosk-dev/lib/mongodb'
import User from '@kiosk-dev/models/user'
export async function POST(request) {
    try{
        await connectMongoDB();
        const{username} = await request.json();
        const user = await User.findOne({ username }).select("_id");
        user && console.log("User: ", user);

        return NextResponse.json({ user })
    }
    catch(error){
        return NextResponse.json({ message: "An error occured while registering the user." }, { status: 500 })
    }
}