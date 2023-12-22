const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const cors = require('cors');//Cross-Origin Resource Sharing issues when running front and backend on diff ports
app.use(bodyParser.json());
app.use(cors());

const INFURA_URL = "https://sepolia.infura.io/v3/b83ea3cf172f4db6a47194c28f9c746d"; // TODO:make more secure
const PRIVATE_KEY = "ca7d29e438c97b791d0bbadeb3f5345f887fc622fdccc179f8812d9c6a2f991b";  // TODO:REPLACE make more secure 
const CONTRACT_ADDRESS = "0xc367396A73C611D10B35fFb11151A1dAB8A8f0eA"; //TODO:REPLACE after final sontract deploy

// Ethereum provider and contract setup
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const CertificateService = require('./artifacts/contracts/CertificateService.sol/CertificateService.json');
const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateService.abi, wallet);

const userRoles = {}; // This will store user roles

// API endpoint to request certificate creation
app.post('/request-certificate-creation', async (req, res) => {
    const { owner, certificateDataHash } = req.body;
    console.log('Requesting certificate creation for:', owner);
    try {
        const transaction = await contract.requestCertificateCreation(owner, certificateDataHash);
        await transaction.wait();
        console.log('Certificate creation request submitted:', transaction);
        res.send({ message: 'Certificate creation request submitted successfully' });
    } catch (error) {
        console.error('Error requesting certificate creation:', error);
        res.status(500).send({ error: 'Error requesting certificate creation' });
    }
});

// API  endpoint to approve certificate creation
app.post('/approve-certificate-creation', async (req, res) => {
    const { certificateId, issuerAddress } = req.body;
    console.log('Approving certificate creation for ID:', certificateId);
    console.log('Approving certificate creation by issuer:', issuerAddress);
    try {
        const transaction = await contract.certificateCreationApproved(certificateId, issuerAddress);
        await transaction.wait();
        console.log('Certificate creation approved:', transaction);
        res.send({ message: 'Certificate creation approved successfully' });
    } catch (error) {
        console.error('Error approving certificate creation:', error);
        res.status(500).send({ error: 'Error approving certificate creation' });
    }
});


// API Endpoint to request a certificate verification with data hash comparison
app.post('/request-verification', async (req, res) => {
    const { certificateId, verifierCertificateDataHash, verifierAddress } = req.body;
    console.log('Requesting verification for certificate ID:', certificateId);
    console.log('Requesting verification for certificate verifier:', verifierAddress);
    try {
        const transaction = await contract.requestVerification(certificateId, verifierCertificateDataHash, verifierAddress);
        await transaction.wait();
        console.log('Verification request submitted:', transaction);
        res.send({ message: 'Verification request submitted successfully' });
    } catch (error) {
        console.error('Error requesting verification:', error);
        res.status(500).send({ error: 'Error requesting verification' });
    }
});


// API endpoint to complete a verification request
app.post('/complete-verification', async (req, res) => {
    const { requestId, isVerified, issuerAddress } = req.body;
    console.log('Completing verification for request ID:', requestId);
    console.log('Completing verification for request issuer:', issuerAddress);
    try {
        const transaction = await contract.completeVerification(requestId, isVerified, issuerAddress);
        await transaction.wait();
        console.log('Verification request completed:', transaction);
        res.send({ message: 'Verification request completed successfully' });
    } catch (error) {
        console.error('Error completing verification request:', error);
        res.status(500).send({ error: 'Error completing verification request' });
    }
});


// API Endpoint to get a specific certificate
app.get('/get-certificate/:id', async (req, res) => {
    console.log('Fetching certificate with ID:', req.params.id);
    try {
        const certificate = await contract.getCertificate(req.params.id);
        console.log('Retrieved Certificate:', certificate);
        res.send(certificate);
    } catch (error) {
        console.error('Error fetching certificate:', error);
        res.status(500).send({ error: 'Error fetching certificate' });
    }
});

// API endpoint to get certificates owned by an address
app.get('/get-owned-certificates/:owner', async (req, res) => {
    const ownerAddress = req.params.owner;
    console.log('Fetching certificates owned by:', req.params.owner);
    try {
        const certificates = await contract.getOwnedCertificates(ownerAddress);
        console.log('Owned Certificates:', certificates);
        res.send(certificates);
    } catch (error) {
        console.error('Error fetching owned certificates:', error);
        res.status(500).send({ error: 'Error fetching owned certificates' });
    }
});

// API endpoint to get certificates requests owned by an address
app.get('/get-certificate-creation-requests/:requester', async (req, res) => {
    const requesterAddress = req.params.requester;
    console.log('Fetching certificate creation requests for user:', requesterAddress);
    try {
        const requests = await contract.getOwnedCertificateCreationRequests(requesterAddress);
        console.log('Certificate Creation Requests:', requests);
        res.send(requests);
    } catch (error) {
        console.error('Error fetching certificate creation requests:', error);
        res.status(500).send({ error: 'Error fetching certificate creation requests' });
    }
});

//API endpoint to get verification requests owned by an address
app.get('/get-owned-verification-requests/:verifier', async (req, res) => {
    const verifierAddress = req.params.verifier;
    console.log('Fetching verification requests made by verifier:', verifierAddress);
    try {
        const requests = await contract.getOwnedVerificationRequests(verifierAddress);
        console.log('Owned Verification Requests:', requests);
        res.send(requests);
    } catch (error) {
        console.error('Error fetching owned verification requests:', error);
        res.status(500).send({ error: 'Error fetching owned verification requests' });
    }
});

// API endpoint to get a specific verification request
app.get('/get-verification-request/:id', async (req, res) => {
    console.log('Fetching verification request with ID:', req.params.id);
    try {
        const request = await contract.getVerificationRequest(req.params.id);
        console.log('Verification Request:', request);
        res.send(request);
    } catch (error) {
        console.error('Error fetching verification request:', error);
        res.status(500).send({ error: 'Error fetching verification request' });
    }
});

// API endpoint to get all pending verification requests
app.get('/pending-verification-requests', async (req, res) => {
    console.log('Fetching all pending verification requests');
    try {
        const pendingRequests = await contract.getPendingVerificationRequests();
        console.log('Pending Verification Requests:', pendingRequests);
        res.send(pendingRequests);
    } catch (error) {
        console.error('Error retrieving pending verification requests:', error);
        res.status(500).send({ error: 'Error retrieving pending verification requests' });
    }
});

// API endpoint to get all pending certificate creation requests
app.get('/pending-certificate-creation-requests', async (req, res) => {
    try {
        const pendingRequests = await contract.getPendingCertificateCreationRequests();
        res.send(pendingRequests);
    } catch (error) {
        console.error('Error retrieving pending certificate creation requests:', error);
        res.status(500).send({ error: 'Error retrieving pending certificate creation requests' });
    }
});


// API endpoint to set user role
app.post('/set-user-role', (req, res) => {
    const { userAddress, role } = req.body;

    if (!userAddress || !role) {
        return res.status(400).send({ error: 'User address and role are required' });
    }

    // Store the role for the user
    userRoles[userAddress] = role;

    res.send({ message: `Role ${role} set for user ${userAddress}` });
});


const PORT = 3000;//TODO:make more dynamic
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
