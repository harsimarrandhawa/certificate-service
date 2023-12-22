import React, { useState } from 'react';
import './App.css';
import MetaMaskLogin from './MetaMaskLogin';
import UserRoleSelection from './UserRoleSelection'; // Import the UserRoleSelection component

function App() {
    const [userAddress, setUserAddress] = useState(null);

    const handleLoginSuccess = (address) => {
        setUserAddress(address);
    };

    return (
        <div className="app-container">
            {!userAddress ? (
                <>
                    <h1 className="headline">Certifcate Service</h1>
                    <p className="slogan">Empowering certificate management with blockchain technology</p>
                    <p className="intro">To begin with our service:</p>
                    <MetaMaskLogin onLoginSuccess={handleLoginSuccess} />
                </>
            ) : (
                <UserRoleSelection userAddress={userAddress} />
            )}
        </div>
    );
}

export default App;
