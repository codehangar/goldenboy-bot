const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const before = require('mocha').before;

chai.use(chaiAsPromised);

before(() =>{
    global.expect = chai.expect;
    global.sinon = require('sinon');
    global.mockery = require('mockery');
});
