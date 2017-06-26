const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const beforeEach = require('mocha').beforeEach;

chai.use(chaiAsPromised);

beforeEach(() =>{
    global.expect = chai.expect;
    global.sinon = require('sinon');
    global.mockery = require('mockery');
});
