import React, { useState } from 'react';
import { Workbook } from 'react-excel-workbook';
import appwriteApi from '../api/appwriteApi';
import XLSX from 'xlsx';

function ExcelUploadAndSubmit() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [numTransactions, setNumTransactions] = useState(0);
  const [logs, setLogs] = useState([]);
  
  const handleFileUpload = async(file) => {
    await appwriteApi.createEmailSession("ashishdawale20@gmail.com", "Ashish@123");
    const reader = new FileReader();
    reader.onload = (e) => {
      const filedata = e.target.result;
      const workbook = XLSX.read(filedata, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headers = rows[0];
      const data1 = rows.slice(1).map((row) => {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });
      setData(data1);
      setNumTransactions(data1.length);
    };
    reader.readAsBinaryString(file);
    setFile(file);
  };

  const handleSubmit = async () => {
    for (let i = 0; i < data.length; i++) {
      const document = data[i];

      // Send the document to the Appwrite collection
      await appwriteApi
        .createDocument('653df5de65e78c507e6e', '653df5e84943e468bea1', document)
        .then((response) => {
          console.log(response);
          setLogs((prevLogs) => [...prevLogs, `Document ${i + 1} created successfully`]);
        })
        .catch((error) => {
          console.error(error);
          setLogs((prevLogs) => [...prevLogs, `Error creating document ${i + 1}: ${error.message}`]);
        });
    }
    setData([]);
    setNumTransactions(0);
    setFile(null);
  };

  return (
    <div style={{ backgroundColor: '#f2f2f2', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Excel Upload Logo" style={{ width: '100px', marginBottom: '20px' }} />
        <Workbook filename="data.xlsx" element={<button>Download Data</button>}>
          <Workbook.Sheet data={data} name="Sheet 1">
            <Workbook.Column label="Date" value="date" />
            <Workbook.Column label="Transaction" value="transaction" />
            <Workbook.Column label="Place" value="place" />
            <Workbook.Column label="Description" value="description" />
            <Workbook.Column label="Category" value="category" />
            <Workbook.Column label="Currency" value="currency" />
            <Workbook.Column label="Amount" value="amount" />
            <Workbook.Column label="Note" value="note" />
            <Workbook.Column label="Tags" value="tags" />
            <Workbook.Column label="Account" value="account" />
          </Workbook.Sheet>
        </Workbook>

        {file && (
          <div>
            <p>Uploaded file: {file.name}</p>
            <p>Number of transactions: {numTransactions}</p>
          </div>
        )}

        {!file && <input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />}

        {file && numTransactions > 0 && <button onClick={handleSubmit}>Submit Data</button>}

        {logs.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Logs:</h3>
            {logs.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExcelUploadAndSubmit;
