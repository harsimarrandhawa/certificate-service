import React, { useEffect, useState } from 'react';
import axios from 'axios'; // for making HTTP requests
import './UserDashboard.css';
import CertificateCreationForm from './CertificateCreationForm';
import CertificateVerificationForm from './CertificateVerificationForm';

const UserDashboard = ({ userAddress, userRole }) => {
    const [requests, setRequests] = useState([]);
    const [currentView, setCurrentView] = useState('Home');
    const [ownedCertificates, setOwnedCertificates] = useState([]);
    const [ownedVerificationRequests, setOwnedVerificationRequests] = useState([]);
    const [ownedCertificateCreationRequests, setOwnedCertificateCreationRequests] = useState([]);
    const [pendingCreationRequests, setPendingCreationRequests] = useState([]);
    const [pendingVerificationRequests, setPendingVerificationRequests] = useState([]);

    useEffect(() => {
        if (userRole === 'issuer') {
            fetchPendingCreationRequests();
            fetchPendingVerificationRequests();
        } else if (userRole === 'verifier/owner') {
            fetchOwnedCertificates();
            fetchOwnedVerificationRequests();
            fetchOwnedCertificateCreationRequests();
        }
    }, [userRole, currentView]);

    const fetchPendingVerificationRequests = async () => {
        try {
            const response = await axios.get('http://localhost:3000/pending-verification-requests');
            console.log("fetchPendingVerificationRequests response data: ", response.data);
            setPendingVerificationRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const fetchPendingCreationRequests = async () => {
        try {
            const response = await axios.get('http://localhost:3000/pending-certificate-creation-requests');
            console.log("fetchPendingCreationRequests response data: ", response.data);
            setPendingCreationRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending certificate creation requests:', error);
        }
    };

    // const fetchOwnedCertificates = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:3000/get-owned-certificates/${userAddress}`);
    //         console.log("fetchOwnedCertificates response data: ", response.data);
    //         setOwnedCertificates(response.data);
    //     } catch (error) {
    //         console.error('Error fetching owned certificates:', error);
    //     }
    // };

    // const fetchOwnedVerificationRequests = async () => {
    //     try {
    //         // Replace with the correct endpoint for fetching verification requests
    //         const response = await axios.get(`http://localhost:3000/get-owned-verification-requests/${userAddress}`);
    //         console.log("fetchOwnedVerificationRequests response data: ", response.data);
    //         setOwnedVerificationRequests(response.data);
    //     } catch (error) {
    //         console.error('Error fetching owned verification requests:', error);
    //     }
    // };

    // const fetchOwnedCertificateCreationRequests = async () => {
    //     try {
    //         // Replace with the correct endpoint for fetching certificate creation requests
    //         const response = await axios.get(`http://localhost:3000/get-certificate-creation-requests/${userAddress}`);
    //         console.log("fetchOwnedCertificateCreationRequests response data: ", response.data);
    //         setOwnedCertificateCreationRequests(response.data);
    //     } catch (error) {
    //         console.error('Error fetching owned certificate creation requests:', error);
    //     }
    // };

    const fetchOwnedCertificates = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/get-owned-certificates/${userAddress}`);
            console.log("fetchOwnedCertificates response data: ", response.data);
            setOwnedCertificates(response.data);
        } catch (error) {
            console.error('Error fetching owned certificates:', error);
        }
    };

    const fetchOwnedVerificationRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/get-owned-verification-requests/${userAddress}`);
            console.log("fetchOwnedVerificationRequests response data: ", response.data);
            setOwnedVerificationRequests(response.data);
        } catch (error) {
            console.error('Error fetching owned verification requests:', error);
        }
    };

    const fetchOwnedCertificateCreationRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/get-certificate-creation-requests/${userAddress}`);
            console.log("fetchOwnedCertificateCreationRequests response data: ", response.data);
            setOwnedCertificateCreationRequests(response.data);
        } catch (error) {
            console.error('Error fetching owned certificate creation requests:', error);
        }
    };

    const handleApproveCertificateCreation = async (certificateId) => {
        // Implement the logic to call '/approve-certificate-creation' endpoint
        
        const issuerAddress = userAddress;
        try {
            const response = await axios.post('http://localhost:3000/approve-certificate-creation', { certificateId, issuerAddress });
            // Refresh the pending requests after approval
            console.log("handleApproveCertificateCreation response: ", response);
            fetchPendingCreationRequests();
        } catch (error) {
            console.error('Error approving certificate creation:', error);
        }
    };

    const handleApproveVerificationRequest = async (requestId) => {
        // Implement the logic to call '/complete-verification' endpoint
        try {
            const response = await axios.post('http://localhost:3000/complete-verification', { requestId, isVerified: true, issuerAddress: userAddress});
            // Refresh the pending requests after approval
            console.log("handleApproveCertificateCreation response: ", response);
            fetchPendingVerificationRequests();
        } catch (error) {
            console.error('Error completing verification request:', error);
        }
    };

    const navigateTo = (viewName) => {
        setCurrentView(viewName);
    };

    // Determine what to render based on the current view
    const renderContent = () => {
        switch (currentView) {
            case 'Home':
                return renderHomeView();
            case 'Create':
                return renderCreateView();
            case 'Verify':
                return renderVerifyView();
            case 'Account':
                return renderAccountView();
            default:
                return <div>Welcome to Certifcare Service</div>;
        }
    };

    const renderHomeView = () => {
        return (
            <div className="main-content-area">
                {userRole === 'issuer' && (
                    <div className="issuer-requests">
                        <h2>Pending Certificate Creation Requests</h2>
                        <div className="pending-creation-requests">
                            {pendingCreationRequests.length > 0 ? (
                                pendingCreationRequests.map((request, index) => (
                                    <div key={index} className="request-item">
                                        <p>Certificate ID: {request[0].hex}</p>
                                        <p>Issuer Address: {request[1]}</p>
                                        <p>Owner Address: {request[2]}</p>
                                        <p>Data: {request[3]}</p>
                                        <p>Is Approved: {request[4] ? 'Yes' : 'No'}</p>
                                        <button className="approve-btn" onClick={() => handleApproveCertificateCreation(request[0].hex)}>Approve Creation</button>
                                    </div>
                                ))
                            ) : (
                                <p>No pending certificate creation requests.</p>
                            )}
                        </div>
                        <h2>Pending Verification Requests</h2>
                        <div className="pending-verification-requests">
                            
                            {pendingVerificationRequests.length > 0 ? (
                                pendingVerificationRequests.map((request, index) => (
                                    <div key={index} className="request-item">
                                        <p>Request ID: {request[0].hex}</p>
                                        <p>Certificate ID: {request[1].hex}</p>
                                        <p>Requester Address: {request[2]}</p>
                                        <p>Issuer Address: {request[3]}</p>
                                        <p>Is Verified: {request[4] ? 'Yes' : 'No'}</p>
                                        <p>Data Hash Matches: {request[5] ? 'Yes' : 'No'}</p>
                                        <button className="approve-btn" onClick={() => handleApproveVerificationRequest(request[0].hex)}>Approve Verification</button>
                                    </div>
                                ))
                            ) : (
                                <p>No pending verification requests.</p>
                            )}
                        </div>
                    </div>
                )}

                {userRole === 'verifier/owner' && (
                    <div className="owner-requests">
                        <h2>Owned Certificates</h2>
                        <div className="owned-certificates">
                            
                            {ownedCertificates.length > 0 ? (
                                ownedCertificates.map((request, index) => (
                                    <div key={index} className="request-item">
                                        <p>Certificate ID: {request[0].hex}</p>
                                        <p>Owner Address: {request[2]}</p>
                                        <p>Data: {request[3]}</p>
                                        <p>Is Approved: {request[4] ? 'Yes' : 'No'}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No owned certifictes.</p>
                            )}
                        </div>
                        <h2>Owned Verification Requests</h2>
                        <div className="owned-verification-requests">
                            
                            {ownedVerificationRequests.length > 0 ? (
                                ownedVerificationRequests.map((request, index) => (
                                    <div key={index} className="request-item">
                                        <p>Request ID: {request[0].hex}</p>
                                        <p>Certificate ID: {request[1].hex}</p>
                                        <p>Requester Address: {request[2]}</p>
                                        <p>Issuer Address: {request[3]}</p>
                                        <p>Is Verified: {request[4] ? 'Yes' : 'No'}</p>
                                        <p>Data Hash Matches: {request[5] ? 'Yes' : 'No'}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No owned verification requests.</p>
                            )}
                        </div>
                        <h2>Owned Certificate Creation Requests</h2>
                        <div className="owned-certificate-creation-requests">
                            {ownedCertificateCreationRequests.length > 0 ? (
                                ownedCertificateCreationRequests.map((request, index) => {
                                    const itemClass = request[4] ? 'request-item-approved' : 'request-item-pending';
                                    return (
                                        <div key={index} className={`request-item ${itemClass}`}>
                                            <p>Certificate ID: {request[0].hex}</p>
                                            <p>Owner Address: {request[2]}</p>
                                            <p>Data: {request[3]}</p>
                                            <p>Is Approved: {request[4] ? 'Yes' : 'No'}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No owned certificate creation requests.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };


    const renderCreateView = () => {
        // Render the form or component to create a new certificate request
        
        return (
            <div>
                <h1> Create New Certificate Request</h1>
                <CertificateCreationForm userAddress={userAddress}/>
            </div>
        );
    };

    const renderVerifyView = () => {
        // Render the form or component to handle verification
        
        return (
            <div>
                <h1> Create Certificate Verfication Request</h1>
                <CertificateVerificationForm userAddress={userAddress}/>
            </div>
        );
    };

    const renderAccountView = () => {
        // Render user's account details
        return (
            <div className="account-view">
                <div className="account-row">
                    <span className="account-title">Your Address:</span>
                    <span className="account-value">{userAddress}</span>
                </div>
                <div className="account-row">
                    <span className="account-title">Your Role:</span>
                    <span className="account-value">{userRole}</span>
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* Fixed Top Section */}
            <div className="fixed-top-container">
                
                <div className="app-name" onClick={() => window.location.href = 'http://localhost:3001'}>
                    Certificate Service
                </div>
                <div className="nav-links">
                
                    <div className="nav-link" onClick={() => navigateTo('Home')}>Home</div>
                    {userRole === 'verifier/owner' && (
                        <>
                            <div className="nav-link" onClick={() => navigateTo('Create')}>Create</div>
                            <div className="nav-link" onClick={() => navigateTo('Verify')}>Verify</div>
                        </>
                    )}
                    <div className="nav-link" onClick={() => navigateTo('Account')}>Account</div>
                </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="dynamic-content-container">
                {renderContent()}
            </div>
        </div>
    );
};

export default UserDashboard;

