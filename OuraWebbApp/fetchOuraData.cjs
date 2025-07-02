const fs = require('fs');
const https = require('https');

const OURA_API_KEY = 'U5XWJBQNQYB2CL2REL5DC5LKIEPRRXCR';
const API_BASE_URL = 'https://api.ouraring.com/v2/usercollection';

// Date range for 2024-2025 data
const START_DATE = '2024-01-01';
const END_DATE = new Date().toISOString().split('T')[0]; // Current date

// Helper function to make API requests
function makeApiRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}${endpoint}?start_date=${START_DATE}&end_date=${END_DATE}`;
    
    const options = {
      headers: {
        'Authorization': `Bearer ${OURA_API_KEY}`,
        'User-Agent': 'OuraWebbApp/1.0'
      }
    };

    console.log(`Fetching: ${url}`);

    https.get(url, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`JSON parse error: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${data}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Helper function to save data to file
function saveDataToFile(filename, data) {
  const filePath = `./src/data/${filename}`;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${filename} (${data.data?.length || 0} records)`);
}

// Main function to fetch all Oura data
async function fetchAllOuraData() {
  console.log('🔄 Starting Oura data fetch...');
  
  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync('./src/data')) {
      fs.mkdirSync('./src/data', { recursive: true });
    }

    console.log('\n📊 Fetching Sleep data...');
    const sleepData = await makeApiRequest('/sleep');
    saveDataToFile('sleep_data.json', sleepData);

    console.log('\n🎯 Fetching Readiness data...');
    const readinessData = await makeApiRequest('/daily_readiness');
    saveDataToFile('readiness_data.json', readinessData);

    console.log('\n🏃 Fetching Daily Activity data...');
    const activityData = await makeApiRequest('/daily_activity');
    saveDataToFile('activity_data.json', activityData);

    console.log('\n💓 Fetching Heart Rate data...');
    const heartRateData = await makeApiRequest('/heartrate');
    saveDataToFile('heart_rate_data.json', heartRateData);

    console.log('\n🌡️ Fetching Daily Sleep data...');
    const dailySleepData = await makeApiRequest('/daily_sleep');
    saveDataToFile('daily_sleep_data.json', dailySleepData);

    // Create combined data file for easy access
    const combinedData = {
      sleep: sleepData,
      readiness: readinessData,
      activity: activityData,
      heartRate: heartRateData,
      dailySleep: dailySleepData,
      lastUpdated: new Date().toISOString(),
      dataRange: {
        startDate: START_DATE,
        endDate: END_DATE
      }
    };

    saveDataToFile('oura_2024_2025_data.json', combinedData);

    console.log('\n✅ All Oura data fetched successfully!');
    console.log(`📁 Data saved to ./src/data/`);
    console.log(`📅 Date range: ${START_DATE} to ${END_DATE}`);
    
    // Print summary
    console.log('\n📈 Data Summary:');
    console.log(`   Sleep records: ${sleepData.data?.length || 0}`);
    console.log(`   Readiness records: ${readinessData.data?.length || 0}`);
    console.log(`   Activity records: ${activityData.data?.length || 0}`);
    console.log(`   Heart rate records: ${heartRateData.data?.length || 0}`);
    console.log(`   Daily sleep records: ${dailySleepData.data?.length || 0}`);

  } catch (error) {
    console.error('❌ Error fetching Oura data:', error.message);
    
    if (error.message.includes('401')) {
      console.error('🔑 Check your API key - it may be invalid or expired');
    } else if (error.message.includes('429')) {
      console.error('⏰ Rate limit exceeded - wait a moment and try again');
    } else if (error.message.includes('404')) {
      console.error('🔍 API endpoint not found - check the endpoint URLs');
    }
  }
}

// Run the script
if (require.main === module) {
  fetchAllOuraData();
}

module.exports = { fetchAllOuraData };