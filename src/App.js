import logo from './logo.svg';
import './App.css';
import React from 'react';
import CertificateCreationForm from './CertificateCreationForm';
import CertificateVerificationForm from './CertificateVerificationForm';
// import any other components you need

function App() {
  // Function to handle certificate creation form submission
  const handleCertificateCreation = (formData) => {
    console.log('Certificate Creation Data:', formData);
    // Send formData to backend or blockchain for certificate creation
  };

  // Function to handle certificate verification form submission
  const handleCertificateVerification = (certificateId) => {
    console.log('Certificate Verification Request for ID:', certificateId);
    // Send request to backend or blockchain for certificate verification
  };

  return (
    <div className="App">
      <h1>Certificate Creation</h1>
      <CertificateCreationForm onSubmit={handleCertificateCreation} />

      <h1>Certificate Verification</h1>
      <CertificateVerificationForm onSubmit={handleCertificateVerification} />
      {/* Other components or content */}
    </div>
  );
}

export default App;
