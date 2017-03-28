/**
 * Created by afaren on 3/28/17.
 */
const express = require('express');
const bodyParser = require('body-parser');


const other = express();
other.use(bodyParser.json());
other.post('/workspace/che', function (req, res) {
  console.log(req.url)
  res.status(200).send('allow pass');
});

const port = require('./constants').proxy_target_port;

other.listen(port, () => {
  console.log(`target listen in ${port}`)
});


