import { NextResponse } from 'next/server';
import { connectMongoDB } from '@kiosk-dev/lib/mongodb'; // Ensure correct path to your db connection file
import UserInformation  from '@kiosk-dev/models/userInformation';
export async function GET(request) {
    try {
        // Connect to MongoDB
        await connectMongoDB();

        // Extract username from query parameters
        const url = new URL(request.url);
        const username = url.searchParams.get('username');

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        // Find the user information by username
        const userInformation = await UserInformation.findOne({ username });

        if (!userInformation) {
            return NextResponse.json({ message: "User information not found" }, { status: 404 });
        }

        return NextResponse.json(userInformation, { status: 200 });
    } catch (error) {
        console.error("Error in GET /loadSaveInformation:", error);
        return NextResponse.json({ message: "An error occurred while retrieving the user information" }, { status: 500 });
    }
}