import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const REDIRECT_URI =
  import.meta.env.NODE_ENV === "production"
    ? "https://pern-store-project.onrender.com"
    : "http://localhost:3000";

function GoogleSignIn() {
    const navigate = useNavigate();
    const googleButtonRef = useRef(null);

    const handleCredentialResponse = useCallback(async (response) => {
        try {
            const {data} = await axios.post('http://localhost:3000/api/users/oauth', {
                id_token: response.credential,
            });

            // console.log('Token received', data.token);
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        }
    }, [navigate]);

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: handleCredentialResponse,
                    ux_mode: "redirect",
                    redirect_uri: REDIRECT_URI, // Make sure this matches Google Cloud Console
                });
    
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: 'outline', size: 'large' }
                );
            } else {
                console.error('Google Identity Script not loaded');
            }
        };

        initializeGoogleSignIn();
    }, [handleCredentialResponse]);

    return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <h1 className='text-4xl font-bold m-1'>Welcome to Pinventory!</h1>
            <p className='text-lg m-2'>Please sign in with Google to continue :D</p>
            <div className='' ref={googleButtonRef}></div>
        </div>
    )   
}

export default GoogleSignIn