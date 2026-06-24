const http = require('http');
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAAWCb28SAA0BR6kIy8NK9K5Wd5lBEkPxjvJ50ohNrSYyn92ArNZAke6bRFeTVr6HtnIcOSY0U5dt3YG3TJOZBtsE3XjUSTLv3oUErEgBLJZCtVnbu25BiS8P8f7KyqvoAMg1XEKbipc2jGcdfiDvJasuf50WnDQobuFFmTyjZChbks3KmK75Fyq7R9ZAC2rbQsab2rT7QNhvL8Yy91sJGHYRrKeCifhZCXBgXJ1wZDZD';
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