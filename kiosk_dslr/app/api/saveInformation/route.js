
import {NextResponse} from 'next/server';
import {connectMongoDB} from '@kiosk-dev/lib/mongodb'
import UserInformation  from '@kiosk-dev/models/userInformation';
export async function POST(request) {
    try {
        // Connect to MongoDB
        await connectMongoDB();

        // Parse the request body
        const {username,...info} = await request.json();
        console.log("request: ",username,);
        console.log("info", info)

        // Check if the document with the provided username already exists
        let userInformation = await UserInformation.findOne({ username });

        if (userInformation) {
            // Update the existing document
            Object.assign(userInformation, info);
            await userInformation.save();
            return NextResponse.json({ message: "User information updated successfully", data: userInformation }, { status: 200 });
        } else {
            // Create a new document
            userInformation = new UserInformation({ username, ...info });
            await userInformation.save();
            return NextResponse.json({ message: "User information created successfully", data: userInformation }, { status: 201 });
        }
    } catch (error) {
        console.error("Error in POST /saveInformation:", error);
        return NextResponse.json({ message: "An error occurred while saving the user information" }, { status: 500 });
    }
}