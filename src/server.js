const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const INFURA_URL = "https://sepolia.infura.io/v3/b83ea3cf172f4db6a47194c28f9c746d"; // TODO:make more secure
const PRIVATE_KEY = "ca7d29e438c97b791d0bbadeb3f5345f887fc622fdccc179f8812d9c6a2f991b";  // TODO:REPLACE make more secure 
const CONTRACT_ADDRESS = "0xd37c5AAD31f1C63E94919797F4ACA9f5D2BFa7D1"; //TODO:REPLACE after final sontract deploy

// Ethereum provider and contract setup
const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const CertificateService = require('./artifacts/contracts/CertificateService.sol/CertificateService.json');
const contract = new ethers.Contract(CONTRACT_ADDRESS, CertificateService.abi, wallet);


// API endpoint for creating a certificate
app.post('/issue-certificate', async (req, res) => {
    const { owner, certificateDataHash } = req.body;
    try {
        const transaction = await contractInstance.issueCertificate(owner, certificateDataHash);
        await transaction.wait();
        res.send({ message: 'Certificate issued successfully' });
    } catch (error) {
        console.error('Error issuing certificate:', error);
        res.status(500).send({ error: 'Error issuing certificate' });
    }
});

// API Endpoint to request a certificate verification
app.post('/request-verification', async (req, res) => {
    const { certificateId } = req.body;
    try {
        const transaction = await contractInstance.requestVerification(certificateId);
        await transaction.wait();
        res.send({ message: 'Verification request submitted successfully' });
    } catch (error) {
        console.error('Error requesting verification:', error);
        res.status(500).send({ error: 'Error requesting verification' });
    }
});


// API endpoint to complete a verification request
app.post('/complete-verification', async (req, res) => {
    try {
        const { requestId, isVerified } = req.body; 

        const transaction = await contractInstance.completeVerification(requestId, isVerified);
        await transaction.wait();

        res.send({ message: 'Verification request completed successfully' });
    } catch (error) {
        console.error('Error completing verification request:', error);
        res.status(500).send({ error: 'Error completing verification request' });
    }
});

// API Endpoint to get a specific certificate
app.get('/get-certificate/:id', async (req, res) => {
    try {
        const certificate = await contractInstance.getCertificate(req.params.id);
        res.send(certificate);
    } catch (error) {
        console.error('Error fetching certificate:', error);
        res.status(500).send({ error: 'Error fetching certificate' });
    }
});

// API endpoint to get certificates owned by an address
app.get('/get-owned-certificates/:owner', async (req, res) => {
    try {
        const certificates = await contractInstance.getOwnedCertificates(req.params.owner);
        res.send(certificates);
    } catch (error) {
        console.error('Error fetching owned certificates:', error);
        res.status(500).send({ error: 'Error fetching owned certificates' });
    }
});

// API ndpoint to get a specific verification request
app.get('/get-verification-request/:id', async (req, res) => {
    try {
        const request = await contractInstance.getVerificationRequest(req.params.id);
        res.send(request);
    } catch (error) {
        console.error('Error fetching verification request:', error);
        res.status(500).send({ error: 'Error fetching verification request' });
    }
});

// API endpoint to get all pending verification requests
app.get('/pending-verification-requests', async (req, res) => {
    try {
        const pendingRequests = await contractInstance.getPendingVerificationRequests();
        res.send(pendingRequests);
    } catch (error) {
        console.error('Error retrieving pending verification requests:', error);
        res.status(500).send({ error: 'Error retrieving pending verification requests' });
    }
});

const PORT = 3000;//TODO:make more dynamic
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
