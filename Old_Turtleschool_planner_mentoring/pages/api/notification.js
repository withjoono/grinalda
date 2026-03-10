const webPush = require('web-push')

webPush.setVapidDetails(
  'mailto:freepina@gmail.com',
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
);

export default (req, res) => {
  if (req.method === 'POST') {
    const {push_token, title, message, url} = req.body;
	console.log(req.body)
    webPush.sendNotification(JSON.parse(push_token), JSON.stringify({title: title, message: message})).then(response => {
      res.writeHead(response.statusCode, response.headers).end(response.body)
    }).catch(err => {
		console.log(err)
      if ('statusCode' in err) {
        res.writeHead(err.statusCode, err.headers).end(err.body);
      } else {
        console.error(err);
        res.statusCode = 500;
        res.end();
      }
    })
  } else {
    res.statusCode = 405;
    res.end();
  }
}