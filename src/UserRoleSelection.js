import React, { useState } from 'react';
import UserDashboard from './UserDashboard'; // Import UserDashboard component
import './UserRoleSelection.css';

const UserRoleSelection = ({ userAddress }) => {
    const [selectedRole, setSelectedRole] = useState('');
    const [roleSet, setRoleSet] = useState(false); // New state to track if the role is set

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const setUserRole = async () => {
        try {
            const response = await fetch('http://localhost:3000/set-user-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userAddress, role: selectedRole }),
            });
            const data = await response.json();
            console.log(data.message);
            // If role set successfully, update state
            setRoleSet(true);
        } catch (error) {
            console.error('Error setting user role:', error);
        }
    };

    return (
        <div>
         {!roleSet ? (
            // Show role selection if role is not set
            
            <div className="user-role-container">
                <div className="app-name">Certifcate Service</div>
                <div className="address-info">
                    <span className="address-label">Welcome! Your Address:</span>
                    <span className="address-value">{userAddress}</span>
                </div>
                <div className="role-selection">
                    <p>Select your role:</p>
                    <label className="role-option">
                        <input type="radio" name="role" value="issuer" onChange={handleRoleChange} />
                        Issuer
                    </label>
                    <label className="role-option">
                        <input type="radio" name="role" value="verifier/owner" onChange={handleRoleChange} />
                        Verifier/Owner
                    </label>
                    
                </div>
                <button className="set-role-btn" onClick={setUserRole}>Set Role</button>
            </div>
        ) : (
            // Show UserDashboard if role is set
            <UserDashboard userAddress={userAddress} userRole={selectedRole} />
        )}
        </div>
    );
};

export default UserRoleSelection;
