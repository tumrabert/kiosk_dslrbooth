"use client"

import React, { useState, useEffect } from 'react'
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { redirect} from 'next/navigation'
import { useRouter } from 'next/navigation';

function RegisterPage() {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router=useRouter();
    const { data: session,status } = useSession();
    useEffect(() => {
        if (status === 'authenticated') {
          const uName= session?.user.username; // Adjust this based on how your session stores the username
          router.push(`/${uName}/welcome`);
        }
      }, [session, status]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(username,password,confirmPassword);

        if (password != confirmPassword) {
            setError("Password do not match!");
            return;
        }

        if ( !username ||  !password || !confirmPassword) {
            setError("Please complete all inputs.");
            return;
        }

        const resCheckUser = await fetch("/api/usercheck", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username })
        })

        const { user } = await resCheckUser.json();

        if (user) { 
            setError("User already exists.");
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username, password
                })
            })

            if (res.ok) {
                const form = e.target;
                setError("");
                setSuccess("User registration successfully!");
                form.reset();
            } else {
                console.log("User registration failed.")
            }

        } catch(error) {
            console.log("Error during registration: ", error)
        }
    }

  return (
    <Container>
        <Navbar session={session}/>
            <div className='flex-grow'>
                <div className="flex justify-center items-center">
                    <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
                        <h3 className='text-3xl'>Register Page</h3>
                        <hr className='my-3' />
                        <form onSubmit={handleSubmit}>

                            {error && (
                                <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                                    {success}
                                </div>
                            )}
                            
                            <input type="text" onChange={(e) => setUserName(e.target.value)} className='w-full bg-gray-200 border-black py-2 px-3 rounded text-lg my-2' placeholder='Enter your username' />
                            <input type="password" onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-200 border-black py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
                            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} className='w-full bg-gray-200 border-black py-2 px-3 rounded text-lg my-2' placeholder='Confirm your password' />
                            <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Sign Up</button>
                        </form>
                        <hr className='my-3' />
                        <p>Go to <Link href="/login" className='text-blue-500 hover:underline'>Login</Link> Page</p>
                    </div>
                </div>
            </div>
        <Footer />
    </Container>
  )
}

export default RegisterPage
