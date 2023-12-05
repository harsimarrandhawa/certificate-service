import React, { useState } from 'react';
import './Forms.css'; // Import the CSS file

function CertificateCreationForm({ onSubmit }) {
  const [owner, setOwner] = useState('');
  const [dataFields, setDataFields] = useState([{ dataType: '', dataValue: '' }]);

  const handleFieldChange = (index, event) => {
    const values = [...dataFields];
    if (event.target.name === "dataType") {
      values[index].dataType = event.target.value;
    } else {
      values[index].dataValue = event.target.value;
    }
    setDataFields(values);
  };

  const handleAddField = () => {
    const values = [...dataFields];
    values.push({ dataType: '', dataValue: '' });
    setDataFields(values);
  };

  const handleRemoveField = (index) => {
    const values = [...dataFields];
    values.splice(index, 1);
    setDataFields(values);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataObject = dataFields.reduce((obj, field) => {
      obj[field.dataType] = field.dataValue;
      return obj;
    }, {});
    onSubmit({ owner, data: dataObject });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Create Certificate</h2>
      <form onSubmit={handleSubmit}>
        
        {dataFields.map((field, index) => (
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
          <button className="form-button" type="button" onClick={handleAddField}>Add Data Field</button>
          <button className="form-button" type="submit">Create Certificate</button>
        </div>
      </form>
    </div>
  );
}


export default CertificateCreationForm;
