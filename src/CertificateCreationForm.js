import React, { useState } from 'react';
import axios from 'axios';
import './CertificateCreationForm.css'; // Ensure you create and style this CSS file accordingly

const CertificateCreationForm = ({ userAddress }) => {
    const [title, setTitle] = useState('');
    const [dataRows, setDataRows] = useState([{ dataType: '', dataValue: '' }]);
    const [submissionStatus, setSubmissionStatus] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDataRowChange = (index, field, value) => {
        const newDataRows = [...dataRows];
        newDataRows[index][field] = value;
        setDataRows(newDataRows);
    };

    const addDataRow = () => {
        setDataRows([...dataRows, { dataType: '', dataValue: '' }]);
    };

    const removeDataRow = (index) => {
        const newDataRows = dataRows.filter((_, i) => i !== index);
        setDataRows(newDataRows);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Example of processing dataRows into a single string (you might use hashing instead)
        const certificateDataHash = dataRows.map(row => `${row.dataType}:${row.dataValue}`).join(';');

        const formData = {
            owner: userAddress,
            certificateDataHash
        };

        try {
            setSubmissionStatus('Submitting request...');
            const response = await axios.post('http://localhost:3000/request-certificate-creation', formData);
            setSubmissionStatus(response.data.message || 'Request submitted successfully');
            // Clear the form after successful submission
            setTitle('');
            setDataRows([{ dataType: '', dataValue: '' }]);
        } catch (error) {
            console.error('Error submitting certificate creation request:', error);
            setSubmissionStatus('Failed to submit request');
        }
    };


    return (
        <div className="certificate-creation-form">
            <div className="form-row">
                <label>Title:</label>
                <input type="text" value={title} onChange={handleTitleChange} />
            </div>
            {dataRows.map((row, index) => (
                <div key={index} className="form-row">
                    <input
                        type="text"
                        value={row.dataType}
                        onChange={(e) => handleDataRowChange(index, 'dataType', e.target.value)}
                        placeholder="Data Type"
                    />
                    <input
                        type="text"
                        value={row.dataValue}
                        onChange={(e) => handleDataRowChange(index, 'dataValue', e.target.value)}
                        placeholder="Data Value"
                    />
                    <button className="del-row-btn" type="button" onClick={() => removeDataRow(index)}>X</button>
                </div>
            ))}
            <button className="add-data-row-btn" type="button" onClick={addDataRow}>Add Data Row</button>
            <div>
                <button className="form-submit-btn " type="button" onClick={handleSubmit}>Submit</button>
            </div>
            {submissionStatus && <p className="submission-status">{submissionStatus}</p>}
        </div>
    );
};

export default CertificateCreationForm;
