// components/UploadImage.js
'use client'
import { useState, useEffect } from 'react';

const UploadImage = () => {
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    // Retrieve the image path from local storage on component mount
    const storedImagePath = localStorage.getItem('backgroundImage');
    if (storedImagePath) {
      setImagePath(storedImagePath);
    }
  }, []);

  const handleImageUpload = (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageBase64 = reader.result;
          setImagePath(imageBase64);
          localStorage.setItem('backgroundImage', imageBase64);
          alert('Image uploaded successfully!');
        };
        reader.onerror = (error) => {
          throw error;
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'block', margin: '20px auto' }}
      />
      {/* {imagePath && (
        <div
          style={{
            width: '100%',
            height: '400px',
            backgroundImage: `url(${imagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )} */}
    </div>
  );
};

export default UploadImage;
