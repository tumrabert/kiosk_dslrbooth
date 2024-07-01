'use client'
import React, { useState, useEffect } from 'react';
import Container from "../../components/Container";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from 'next/navigation';
import ReactLoading from "react-loading";
import UploadImage from '../../components/UploadImage';

interface FormData {
  username: string;
  price: string;
  paymentAPI: string;
  appAPI: string;
  //background?: File; // Optional because the user might not upload an image
}

const SettingPage = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    price: '',
    paymentAPI: '',
    appAPI: '',
    //background: undefined,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: session, status } = useSession();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFormData(prevData => ({
  //       ...prevData,
  //       background: e.target.files[0],
  //     }));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    //console.log("Form submitted with:", formData);
   //1. check call method  get  formData.appAPI must return respond 200
   //2

    // Clear previous messages
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/saveInformation', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.status === 200 || response.status === 201) {
        setSuccess(data.message);
       // console.log('Success:', data);

        // Optionally, you can redirect or perform additional actions
        // router.push('/some-page'); // Redirect to another page
      } else {
        setError(data.message || 'An error occurred while submitting the form');
        console.error('Error:', data);
      }
    } catch (error: any) {
      setError(`An error occurred: ${error.message}`);
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <Navbar session={session} username={username} />
      <div className='flex-grow'>
      
      




        <div className="flex justify-center items-center">
        {isLoading ? (
        <div>
          <h2>Loading</h2>
          <ReactLoading type="balls" color="#0000FF" height={100} width={50} />
        </div>
          
          ) : (
          <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
            <h3 className='text-3xl'>Setting</h3>
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

              <div className="w-72">
                <div className="input-container">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder=" "
                    required
                  />
                  <label className="input-label">Price (THB)</label>
                </div>

                <div className="input-container">
                  <input
                    type="text"
                    name="paymentAPI"
                    value={formData.paymentAPI}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder=" "
                    required
                  />
                  <label className="input-label">Payment Gateway (API)</label>
                </div>

                <div className="input-container">
                  <input
                    type="text"
                    name="appAPI"
                    value={formData.appAPI}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder=" "
                    required
                  />
                  <label className="input-label">Application API</label>
                </div>


                <div className="flex justify-center p-5">
                  <button type='submit' className='bg-green-500 text-white border p-1 rounded text-m my-2'>Save</button>
                </div>
              </div>
            </form>
            <hr className='my-3' />
              <div className="flex-row p-2">
              <h3 className='text-xl'>Upload an Image to Change Background</h3>
                  <UploadImage/>
                </div>
          </div>)}
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default SettingPage;
