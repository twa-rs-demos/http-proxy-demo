/**
 * Created by afaren on 3/28/17.
 */
const app = require('express')();
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const constants = require('./constants');


app.use(bodyParser.json());


app.use(proxy('http://localhost', {
  port: constants.proxy_target_port,
  filter: (req) => {
    console.log('path: ' + require('url').parse(req.url).path);
    if (req.body.userId === 2) {   /* userId 与 workspaceId 是否配对*/
      console.log('userId: ' + req.body.userId)
      return true;
    }
  },
  forwardPath: (req, res) => {
    return require('url').parse(req.url).path + '/che';
  }
}));


// add proxy for paper-api
app.use('/paper-api', proxy('http://localhost', {
  port: constants.paper_api_port,
  forwardPath: (req, res) => {
    return require('url').parse(req.url).path + 'paper-api/inspector';
  }
}));


const port = 9999;
app.listen(port, () => {
  console.log(`proxy listen in ${port}`)
})