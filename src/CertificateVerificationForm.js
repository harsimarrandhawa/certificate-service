import React, { useState } from 'react';
import './Forms.css'; // Import the CSS file

function CertificateVerificationForm({ onSubmit }) {
  const [certificateId, setCertificateId] = useState('');
  const [verificationFields, setVerificationFields] = useState([{ dataType: '', dataValue: '' }]);

  const handleFieldChange = (index, event) => {
    const values = [...verificationFields];
    if (event.target.name === "dataType") {
      values[index].dataType = event.target.value;
    } else {
      values[index].dataValue = event.target.value;
    }
    setVerificationFields(values);
  };

  const handleAddField = () => {
    const values = [...verificationFields];
    values.push({ dataType: '', dataValue: '' });
    setVerificationFields(values);
  };

  const handleRemoveField = (index) => {
    const values = [...verificationFields];
    values.splice(index, 1);
    setVerificationFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataForVerification = verificationFields.reduce((obj, field) => {
      obj[field.dataType] = field.dataValue;
      return obj;
    }, {});
    onSubmit({ certificateId, data: dataForVerification });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Verify Certificate</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label">Certificate ID:</label>
        <input
          className="form-input"
          type="text"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />
        {verificationFields.map((field, index) => (
          <div className="form-row" key={index}>
            <label className="form-label">Data Type:</label>
            <input
              className="form-input"
              type="text"
              name="dataType"
              value={field.dataType}
              onChange={(e) => handleFieldChange(index, e)}
            />
            <label className="form-label">Data Value:</label>
            <input
              className="form-input"
              type="text"
              name="dataValue"
              value={field.dataValue}
              onChange={(e) => handleFieldChange(index, e)}
            />
            <button className="form-button remove-button" type="button" onClick={() => handleRemoveField(index)}>Remove</button>
          </div>
        ))}
        <div className="inline-buttons">
          <button className="form-button" type="button" onClick={handleAddField}>Add Verification Field</button>
          <button className="form-button" type="submit">Verify Certificate</button>
        </div>
      </form>
    </div>
  );
}


export default CertificateVerificationForm;
