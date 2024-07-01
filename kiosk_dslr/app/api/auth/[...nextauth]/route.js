import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@kiosk-dev/lib/mongodb";
import User from "@kiosk-dev/models/user";
import bcrypt from 'bcryptjs'

const authOptions = {
    providers: [
        CredentialsProvider({
          name: 'credentials',
          credentials: {},
          async authorize(credentials) {
           
            const { username, password } = credentials;

            try {

                await connectMongoDB();
                const user = await User.findOne({ username });

                if (!user) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    return null;
                }

                console.log(user);
                return user;

            } catch(error) {
                console.log("Error: ", error)
            }

          }
        })
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {

            if (user) {
                return {
                    ...token,
                    id: user._id,
                    role: user.role,
                    username: user.username
                }
            }

            return token
        },
        async session({ session, user, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role,
                    username: token.username
                }
            }
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }

