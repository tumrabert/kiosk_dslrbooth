"use client"
import React, { useState,useEffect } from 'react'
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
function LoginPage() {
    const [username,setUserName] = useState('');
    const [password,setPassword] = useState('');

    const[error,setError] = useState('');
    const router=useRouter();
    const { data: session,status } = useSession();
    useEffect(() => {
        if (status === 'authenticated') {
          const username = session?.user.username; // Adjust this based on how your session stores the username
          router.push(`/${username}/welcome`);
        }
      }, [session, status, router]);

    const handleSubmit=async(e)=>{
        e.preventDefault();

        if(!username || !password){
            setError('Please fill all the fields')
            return;
        }

        try{
            const res = await signIn('credentials',{redirect:false,username,password});
            //console.log("login res: ",res)
            if(res.error){
                setError("Invalid Credentials");
                return
            }
            router.push(`/${username}/welcome`);
        }
        catch(err){
            console.log("Error during login",err)
        }
    }   
  return (
    <Container>
        <Navbar session={session}/>
            <div className='flex-grow'>
                <div className="flex justify-center items-center">
                    <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
            <h3>Login Page</h3>
            <form onSubmit={handleSubmit}>
                {error && (<div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                    {error}
                    </div>)}

                    <input type='text' placeholder='Username' value={username} onChange={(e)=>setUserName(e.target.value)} className='border border-gray-300 rounded-md p-1 mt-2'/>
                    <input type='password' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} className='border border-gray-300 rounded-md p-1 mt-2'/>
                    <button type='submit' className='bg-blue-500 text-white rounded-md p-1 mt-2'>Login</button>

            </form>
            </div>
                </div>
            </div>
        <Footer />
    </Container>
  )
}

export default LoginPage
