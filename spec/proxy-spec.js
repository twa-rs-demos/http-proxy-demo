/**
 * Created by afaren on 3/27/17.
 */
'use strict';

const assert = require('assert');
const express = require('express');
const http = require('http');
const request = require('supertest');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');


function proxyTarget(port) {
  const other = express();
  other.use(bodyParser.json());
  other.get('/workspace', function (req, res) {
    if (req.body.userId === 2) {
      res.status(200).send('allow pass');
    }
  });
  return other.listen(port);
}


describe('proxy', function () {

  let app, other;

  beforeEach(function () {
    const port = 3333;
    app = express();
    app.use(bodyParser.json());
    app.use(proxy('localhost', {
      port: port,
      filter: (req) => {
        if (req.body.userId === 2) {   /* userId 与 workspaceId 是否配对*/
          return true;
        }
      },
      forwardPath: (req, res) => {
        return require('url').parse(req.url).path;
      }
    }));

    other = proxyTarget(port, 1000);

  });


  afterEach(function () {
    other.close();
  });


  it('should allow pass when userId is 2', function (done) {
    request(app)
      .get('/workspace')
      .send({userId: 2})
      .expect(200)
      .expect("allow pass")
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done(err);
      });
  })
  it('should block request when userId is not 2', function (done) {
    request(app)
      .get('/workspace')
      .send({userId: 3})
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done(err);
      });
  })
});
