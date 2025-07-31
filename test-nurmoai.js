const fetch = require('node-fetch');

const API_KEY = 'nu-bVI8A2TPpxfwfxPP4oKrkvq5mlgwj8efUcQHstcoE8Knvs4M';
const API_URL = 'https://api.nurmo.app/v1/chat/completions';
const CHARACTER_ID = '43413d25-073c-4f3d-8cf1-f1c98cfa00b3';

async function testNurmoAI() {
    console.log('Testing NurmoAI API...');
    console.log('API URL:', API_URL);
    console.log('Character ID:', CHARACTER_ID);
    console.log('API Key:', API_KEY.substring(0, 10) + '...');
    console.log('');

    try {
        const requestBody = {
            messages: [
                { role: 'user', content: 'Hello! Can you tell me about AI and cybersecurity?' }
            ],
            model: 'nurmo-3',
            character: CHARACTER_ID
        };

        console.log('Request body:', JSON.stringify(requestBody, null, 2));
        console.log('');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('');

        const responseText = await response.text();
        console.log('Response body:', responseText);
        console.log('');

        if (!response.ok) {
            console.error('❌ API request failed');
            return;
        }

        const data = JSON.parse(responseText);
        console.log('✅ API request successful!');
        console.log('Parsed response:', JSON.stringify(data, null, 2));

        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('\n🤖 AI Response:', data.choices[0].message.content);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Test alternative endpoints
async function testAlternativeEndpoints() {
    console.log('\n=== Testing Alternative Endpoints ===\n');

    const endpoints = [
        'https://api.nurmo.app/v1/chat/completions',
        'https://api.nurmo.app/v1/completions',
        'https://api.nurmo.app/completions',
        'https://api.nurmo.ai/v1/chat/completions'
    ];

    for (const endpoint of endpoints) {
        console.log(`Testing endpoint: ${endpoint}`);
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'Hello' }],
                    model: 'nurmo-3',
                    character: CHARACTER_ID
                })
            });

            const responseText = await response.text();
            console.log(`Status: ${response.status}`);
            console.log(`Response: ${responseText.substring(0, 200)}...`);
            console.log('');

        } catch (error) {
            console.log(`Error: ${error.message}`);
            console.log('');
        }
    }
}

// Test different request formats
async function testDifferentFormats() {
    console.log('\n=== Testing Different Request Formats ===\n');

    const formats = [
        {
            name: 'Basic NurmoAI',
            body: {
                messages: [{ role: 'user', content: 'Hello' }],
                model: 'nurmo-3',
                character: CHARACTER_ID
            }
        },
        {
            name: 'Without Character',
            body: {
                messages: [{ role: 'user', content: 'Hello' }],
                model: 'nurmo-3'
            }
        },
        {
            name: 'With System Message',
            body: {
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'Hello' }
                ],
                model: 'nurmo-3',
                character: CHARACTER_ID
            }
        },
        {
            name: 'OpenAI Format',
            body: {
                messages: [{ role: 'user', content: 'Hello' }],
                model: 'gpt-3.5-turbo'
            }
        }
    ];

    for (const format of formats) {
        console.log(`Testing format: ${format.name}`);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify(format.body)
            });

            const responseText = await response.text();
            console.log(`Status: ${response.status}`);
            console.log(`Response: ${responseText.substring(0, 200)}...`);
            console.log('');

        } catch (error) {
            console.log(`Error: ${error.message}`);
            console.log('');
        }
    }
}

// Run tests
async function runAllTests() {
    console.log('🚀 Starting NurmoAI API Tests\n');
    
    await testNurmoAI();
    await testAlternativeEndpoints();
    await testDifferentFormats();
    
    console.log('✅ All tests completed');
}

runAllTests().catch(console.error); 