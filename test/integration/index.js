const assert = require("assert");
const request = require('supertest');
const app = require('../../server/server').app;
const db = require('../../db');

describe('Hitting API endpoints', () => {

    /* Spin up mongodb and populate with mock data, before conducting any integration tests */
    before(function (done) {
        db.connect().then(() => {
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

    describe('GET collection names', function () {
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

    describe('GET collection that does not exist', function () {
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

    describe('GET document that does not exist in collection', function () {
        it('should return 404', function (done) {
            request(app)
                .get('/api/v1/trips/3', {})
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST valid document into collection', function () {
        it('should return 201', function (done) {
            request(app)
                .post('/api/v1/trips', { "_id": 2, "title": "Test" })
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('PUT and update valid document in collection', function () {
        before(function (done) {
            request(app)
                .post('/api/v1/trips', { "_id": 3, "title": "Test" }).expect('Content-Type', /json/).end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
        it('should return 204', function (done) {
            request(app)
                .put('/api/v1/trips/3', { "title": "Updated title" })
                .expect(204)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('DELETE existing document from collection', function () {
        it('should return 204', function (done) {
            request(app)
                .delete('/api/v1/trips/1')
                .expect(204)
                .end(function (err, res) {
                    if (err) return done(err);
                    done();
                });
        });
    });
});