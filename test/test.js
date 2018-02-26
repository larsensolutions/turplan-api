const assert = require("assert");
const request = require('supertest');
const app = require('../server').app;

console.log("Running tests");

describe('Populate mongodb with data', function () {
    it('Should populate data', function (done) {
        app.once("ready", function(){
            done();
         })
    });
});

describe('GET /api/v1', function () {
    it('should return 200', function (done) {
        request(app)
            .get('/api/v1/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /api/v1/collections', function () {
    it('should return 200', function (done) {
        request(app)
            .get('/api/v1/collections')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return expected JSON', function (done) {
        request(app)
            .get('/api/v1/collections')
            .expect('Content-Type', /json/)
            .expect({ "Items": ["trips", "users"] })
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
    after(() => {
        process.exit();
    })
});




