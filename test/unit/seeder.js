'use strict'

const Seeder = require('../../db/seeder.js')
const expect = require('chai').expect

describe('Seeder', () => {
    describe("Structure", () => {
        it('should export a object', () => {
            expect(Seeder).to.be.a('object')
        })
        it('should return self on seed invoke', () => {
            const usersUpResult = Seeder.seed()
            expect(usersUpResult).to.equal(Seeder);
        })
        it('should return promise on data invoke', () => {
            const usersUpResult = Seeder.with()
            expect(usersUpResult.then).to.be.a('Function')
            expect(usersUpResult.catch).to.be.a('Function')
        })
    })
    describe("Bad input behaviour", () => {
       
    })
    describe("Correct input behaviour", () => {
        
    })
})