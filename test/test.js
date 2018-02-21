const assert = require('assert');
const http = require("http");
const request = require('supertest');

const app = require('../server').app;
const server = require('../server').server;

describe('GET /api/v1', function () {
    it('should return 200', function (done) {
        request(app)
        .get('/api/v1/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
    after(()=>{
        server.close();
        process.exit();
    })
});

