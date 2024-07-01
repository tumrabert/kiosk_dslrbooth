"use client"

import React from 'react'
import Link from 'next/link'
import { useState,useEffect } from 'react'    
import { signOut } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
function Navbar({ session,username}) {
    const [welcomePage, setWelcomePage] = useState('');
    const [settingPage, setSettingPage] = useState(''); 
    useEffect(() => {
        //console.log("USERNAME: ",username);
        if (username) {
            setWelcomePage(`../${username}/welcome`);
            setSettingPage(`../${username}/setting`);
        }
    }, [username]);
  return (
    <nav className='flex justify-between items-center shadow-md p-5'>
        <ul className='flex space-x-4'>
            {!session && !username ? (
                <>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/register">Register</Link></li>
                </>
            ) : (
                
                <>
                    <li><Link href={welcomePage} className='bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2'>HomePage</Link></li>
                    <li><Link href={settingPage} className='bg-gray-700 text-white border py-2 px-3 rounded-md text-lg my-2'>Setting</Link></li>
                    <li><a onClick={() => signOut()} className='bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2'>Logout</a></li>
                </>
            )}
        </ul>
    </nav>
  )
}

export default Navbar
