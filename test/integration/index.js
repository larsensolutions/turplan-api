const assert = require("assert");
const request = require('supertest');
const app = require('../../server/server').app;
const db = require('../../db');

describe('Hitting API endpoints', () => {

    /* Spin up mongodb and populate with mock data, before conducting any integration tests */
    before(function (done) {
        db.connect().then(()=>{
            app.start();
            done();
        });
    });

    /* Clean up and close server after tests */
    after(function () {
        app.close();
    });

    /* Integration tests */

    describe('GET root / ', function () {
        it('should return 200', function (done) {
            request(app)
                .get('/api/v1/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET all collection names', function () {
        it('should return 200', function (done) {
            request(app)
                .get('/api/v1/collections')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(done);
        });
        it('should return JSON', function (done) {
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

    describe('GET a collection that doesnt exist', function () {
        it('should return 404', function (done) {
            request(app)
                .get('/api/v1/doesntexists', {})
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET item that doesnt exist in collection', function () {
        it('should return 404', function (done) {
            request(app)
                .get('/api/v1/trips/1', {})
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });
});