import axios from 'axios';

const API_URL = 'http://localhost:4000/api';
// You'll need to fill these with actual tokens from your environment
const COMPANY_TOKEN = 'YOUR_COMPANY_TOKEN'; 

async function testDeleteApplication(applicationId: string) {
  try {
    console.log(`Testing deletion of application: ${applicationId}`);
    const res = await axios.delete(`${API_URL}/company/applications/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${COMPANY_TOKEN}`
      }
    });
    console.log('Success:', res.data);
  } catch (err: any) {
    console.error('Error:', err.response?.data || err.message);
  }
}

// Example usage:
// testDeleteApplication('some-app-id');
