"use client"
import {useState,useEffect} from 'react';
import Image from "next/image";
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from 'next/navigation'
import ReactLoading from "react-loading";
interface FormData {
  username: string;
  price: string;
  paymentAPI: string;
  appAPI: string;
  //background?: File; // Optional because the user might not upload an image
}
export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    price: '',
    paymentAPI: '',
    appAPI: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    // Retrieve the image path from local storage on component mount
    const storedImagePath = localStorage.getItem('backgroundImage');
    if (storedImagePath) {
      setImagePath(storedImagePath);
    }
  }, []);

  
  const router = useRouter(); // Use the useRouter hook
  const { data: session,status } = useSession();
    if (!session) router.replace("../login");

    
  const { username } = useParams();
  useEffect(() => {
    //console.log('query username dynamic:', username);
    setFormData(prevState => ({
      ...prevState,
      username: username, // Replace 'newUsername' with the actual username value you want to set
    }));
  }, []);

   useEffect(() => {
    if (!username) return;

    async function loadUserInformation() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/loadSaveInformation?username=${username}`);

        if (response.status === 404) {
          setError('No settings found. Please provide your setting information.');
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
       // console.log('Loaded user information:', data);

        // Update the state with the loaded data
        setFormData(prevData => ({
          ...prevData,
          username,
          price: data.price,
          paymentAPI: data.paymentAPI,
          appAPI: data.appAPI,
        }));
      
      } catch (error) {
        console.error('Error loading user information:', error);
        setError('Failed to load user information. Please try again later.');
      } finally {
        setIsLoading(false); // End loading regardless of the outcome
      }
    }

    loadUserInformation();
  }, [username]);

  function handleStart(e) {
    e.preventDefault();
    //call localhost:3000/api/start
  }

    

  return (
    <main>
      <Container>
        <Navbar session={session} username={username} />
        <div className="bg-gray-100 flex items-center justify-center h-screen"
          style={{
            backgroundImage: imagePath ? `url(${imagePath})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
          {isLoading ? (
            <div>
              <h2>Loading</h2>
              <ReactLoading type="balls" color="#0000FF" height={100} width={50} />
            </div>
          ) : error ? (
            <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
              {error}
            </div>
          ) : (
            <div className="flex items-center justify-center w-screen h-screen">
              <button className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-2xl w-500px h-500px flex items-center justify-center p-10"
                onClick={() => handleStart()}>
                Start
              </button>
            </div>
          )}
        </div>
        <Footer />
      </Container>
    </main>
  );}