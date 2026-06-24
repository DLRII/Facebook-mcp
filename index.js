const http = require('http');
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || 'EAAWCb28SAA0BR82zZC1m3ZCh8GvWhj93UrUicxlIqoFmsHvyN9E8ThrwzOTcTZAcK1aF4yqlMZBtOn9Q6XZAgLk18ZCJLLxSgVFMTNi5oJrnADOBt4S0LFFA0nfDiA9G7uJswl40ai5WYTet8r3iqnTXSD4mrYBqD34AbgtBpWZANZBkz1F0AeFWVCfJ6R6i3cLZBDm4ZD';
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

const cron = require('node-cron');
const fs = require('fs');

cron.schedule('* * * * *', async () => {
  try {
    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
    const now = new Date();
    let updated = false;
    for (const post of posts) {
      if (!post.posted && new Date(post.scheduled_time) <= now) {
        try {
          const response = await axios.post(
            'https://graph.facebook.com/v25.0/' + PAGE_ID + '/feed',
            { message: post.message, access_token: PAGE_ACCESS_TOKEN }
          );
          post.posted = true;
          updated = true;
          console.log('Posted:', post.id, response.data.id);
        } catch (err) {
          console.error('Failed to post:', post.id, err.message);
        }
      }
    }
    if (updated) fs.writeFileSync('posts.json', JSON.stringify(posts, indent=2));
  } catch (err) {
    console.error('Scheduler error:', err.message);
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));