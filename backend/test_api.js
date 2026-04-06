const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/items');
    console.log('Response format:', JSON.stringify(res.data, null, 2));
    if (res.data.success && Array.isArray(res.data.data)) {
      console.log('✅ Standard format detected: { success: true, data: [...] }');
    } else {
      console.log('❌ Unexpected format!');
    }
  } catch (err) {
    if (err.response && err.response.status === 429) {
      console.log('⚠️ Rate limited! Try again later or restart server.');
    } else {
      console.error('Test error:', err.message);
    }
  }
}

test();
