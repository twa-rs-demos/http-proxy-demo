/**
 * Created by afaren on 3/28/17.
 */
const app = require('express')();
const bodyParser = require('body-parser');
const proxy = require('http-proxy-middleware');
const constants = require('./constants');


app.use(bodyParser.json());

const options = {
  target: 'http://localhost:8080', // target host
  ws: true                         // proxy websockets
};


const cheProxy = proxy(options);
app.use('che/', cheProxy)
app.use(cheProxy);
const port = 9999;


app.listen(port, () => {
  console.log(`proxy listen in ${port}`)
})
