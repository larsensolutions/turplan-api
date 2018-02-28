/* Test suite*/

describe('Turplan.no API Unit Tests', function () {
    return require('./unit/seeder');
});

describe('Turplan.no API Integration Tests', function () {
    return require('./integration');
});