"use client"
import useStoreSettings from '@/zustand/Setting/store';
import { useState } from 'react';
import defPic from '../../public/default-pro.jpg';


const SettingsPage = () => {
    const { logo, setLogo } = useStoreSettings();
    const [imageFile, setImageFile] = useState(null); // State for the uploaded image file
    const [uploadStatus, setUploadStatus] = useState(''); // State for upload status

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleUpload = async () => {
        if (!imageFile) return; // Check if an image is selected

        setUploadStatus('uploading'); // Set upload status

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event) => {
            const base64Data = event.target.result;
            setLogo(base64Data); // Update logo in store
            window.api.saveSetting(base64Data)
                .then(() => {
                    setUploadStatus('success'); // Set success message
                    setImageFile(null); // Clear image selection
                })
                .catch((error) => {
                    console.error('Error saving logo:', error);
                    setUploadStatus('error'); // Set error message
                });
        };
        reader.onerror = (error) => {
            console.error('Error reading image:', error);
            setUploadStatus('error'); // Set error message
        };
    };

    return (
        <div className="p-4">
            <h2>Settings</h2>
            <div className="flex items-center mb-4">
                <label htmlFor="logo" className="mr-4">
                    Logo:
                </label>
                <img src={logo || `${defPic}`} alt="Logo" className="w-20 h-20 rounded-md" />
            </div>
            <div className="mb-4">
                <label htmlFor="logo-upload" className="block mb-2">
                    Upload Logo:
                </label>
                <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full p-3 rounded-md border focus:outline-none focus:border-blue-500"
                />
            </div>
            <button onClick={handleUpload} className="btn bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md">
                Save Logo
            </button>
            {uploadStatus === 'uploading' && <p className="text-blue-500 mt-2">Uploading...</p>}
            {uploadStatus === 'success' && <p className="text-green-500 mt-2">Logo saved successfully!</p>}
            {uploadStatus === 'error' && <p className="text-red-500 mt-2">Error saving logo. Please try again.</p>}
        </div>
    );
};

export default SettingsPage;
