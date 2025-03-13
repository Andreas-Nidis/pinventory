import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
                });
    
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    // document.getElementById('google-sign-in-button'),
                    { theme: 'outline', size: 'large' }
                );
            } else {
                console.error('Google Identity Script not loaded');
            }
        };

        initializeGoogleSignIn();
    }, [handleCredentialResponse]);

    return (
        <div ref={googleButtonRef}></div>
    )
}

export default GoogleSignIn