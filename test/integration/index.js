const assert = require("assert");
const request = require('supertest');
const app = require('../../server/server').app;
const db = require('../../server/server').MongoWrapper;

describe('Seeder 2', () => {
/* Spin up mongodb and populate with data, before conducting any integration tests */
before(function (done) {
    db.connect();
    app.once("ready", function () {
        done();
    })
});

/* Clean up and close server after tests */
after(function () {
    app.close();
});

/* Integration tests */

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

describe('GET /api/v1/{collection} that doesnt exist', function () {
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

describe('GET /api/v1/{collection}/{id} that doesnt exist', function () {
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