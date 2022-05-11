
const axios = require('axios');

async function makeRequest() {
    let payload = {
        name: 'test',
        quantity: 1,
        city: 'New York',
        description: 'test',
    }
    const config = {
        method: 'post',
        url: 'http://localhost:3000/api/products/',
        data: {
            name: 'test',
            quantity: '1',
            city: 'Boston',
            description: 'test',
        }
    }

    let res = await axios.post('http://localhost:3000/api/products', payload);

    console.log(res.data.data);
}

makeRequest();