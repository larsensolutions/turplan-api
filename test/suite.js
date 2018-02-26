const assert = require("assert");
const request = require('supertest');
const app = require('../server').app;

/* Test suite*/
describe('Turplan.no API', function () {

    /* Spin up mongodb and populate with data, before conducting any tests */
    before(function (done) {
        app.once("ready", function () {
            done();
        })
    });

    /* Clean up and close server after tests */
    after(function () {
        process.exit();
    });

    /* TESTS */

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
    });
});







