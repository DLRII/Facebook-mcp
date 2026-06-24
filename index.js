const http = require('http');
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAAWCb28SAA0BR32gkSn5t6pgP55ZBNbfesI6WcfRTY4bEucWXsy3kaQlj2WHiy2idjb0R6dEeHUoeZAUPbVgVeU4d7cprqxBEIZC9LZAMDp8cpctO2bGTnQ8oN9DvXk1h8iX7k9Kc0F9URSiX801XwLYjZBDWN5XJz3vo8AqGRbXzF4osDb6CXA6HLpifIoh2pjyN4vWf5n4sb6vt4ZBykAtYfpjjdSBIZB6X9KzX1kZAXuhllFJPoHJp03ZA6R7a5OTe1IXOUeRSHAijCOrMgDpPIEZBZA';
const PAGE_ID = process.env.PAGE_ID || '107484912297289';
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/post') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { message } = JSON.parse(body);
        const response = await axios.post('https://graph.facebook.com/v25.0/' + PAGE_ID + '/feed', { message, access_token: PAGE_ACCESS_TOKEN });
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ success: true, post_id: response.data.id }));
      } catch (error) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else { res.writeHead(200); res.end('Facebook MCP Server running'); }
});
server.listen(3000, () => console.log('Server running on port 3000'));