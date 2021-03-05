'use strict';

console.log('loaded');
const testVars = require('./../data');

const assert = require('chai').assert,
  expect = require('chai').expect,
  Client = require('../../index'),
  url = 'http://localhost:8000';
require('./mock')(url);
describe('testing client lib for registerBlast endpoints', () => {
  describe('Login', function testLogin() {
    it('Should successfully login and return valid token', function () {
      const client = new Client(testVars.config.valid);

      return client
        .login()
        .catch(error => {
          expect(error).to.equal(undefined);
        })
    });

    it('Should fail for invalid api key', function () {
      const client = new Client(testVars.config.invalidApiKey);

      return client
        .login()
        .catch(error => {
          expect(error).to.eql('Login failed');
        })
    });

    it('Should fail for invalid credentials', function () {
      const client = new Client(testVars.config.invalidCredential);

      return client
        .login()
        .catch(error => {
          expect(error).to.eql('Login failed');
        })
    });
  });
  describe('Test examGroups method', function () {
    it('Should successfully return exam groups', () => {
      const client = new Client(testVars.config.valid);
      client
        .getExamGroups(testVars.campusKey.pass)
        .then(result => {
          expect(result.to.eql(testVars.examGroups.correctCampusKey));
        });
    });

    it('Should fail for client side validation', () => {
      const client = new Client(testVars.config.valid);

      client
        .getExamGroups({})
        .catch(error => {
          expect(error).to.equal('campusKey should be a string');
        });
    });

    it('Should fail for invalid [campusKey]', () => {
      const client = new Client(testVars.config.valid);

      client
        .getExamGroups(testVars.campusKey.fail)
        .catch(error => {
          expect(error).to.equal(testVars.examGroups.wrongCampusKey);
        });
    });
  });

  describe('Should test cancelAppointment method', () => {
    it('Should work correctly', (done) => {
      const client = new Client(testVars.config.valid);
      client
        .cancelAppointment(testVars.campusKey.pass, testVars.appointmentId.pass)
        .then(result => {
          expect(result).to.have.property('cancel');
          expect(result.cancel).to.equal('success');
          done();
        })
        .catch(e => {
          console.log(e);
          expect(e).to.equal(null);
        });
    });
    it('Should fail because of client side validation', done => {
      const client = new Client(testVars.config.valid);
      client
        .cancelAppointment(1231, testVars.appointmentId.pass)
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          const error = e;
          expect(error).to.equal('campusKey should be a string');
          done();
        });
    });
    it('Should fail because of bad campus key', done => {
      const client = new Client(testVars.config.valid);
      client
        .cancelAppointment(testVars.campusKey.fail, testVars.appointmentId.pass)
        .then(res => {
        })
        .catch(result => {
          expect(result).to.have.property('cancel');
          expect(result).to.have.property('message');
          expect(result.cancel).to.equal('error');
          expect(
            result.message
          ).to.equal('This registration may not be canceled online at this time.');
          done();
        });
    });
    it('Should fail because of bad appointment Id', done => {
      const client = new Client(testVars.config.valid);
      client
        .cancelAppointment(testVars.campusKey.pass, testVars.appointmentId.fail)
        .then(res => {
        })
        .catch(result => {
          expect(result).to.have.property('cancel');
          expect(result).to.have.property('message');
          expect(result.cancel).to.equal('error');
          expect(
            result.message
          ).to.equal('This registration may not be canceled online at this time.');
          done();
        });
    });
  });
  describe('Should test getAppointmentDetails method', () => {
    it('Should work correctly', () => {
      const client = new Client(testVars.config.valid);
      return client
        .getAppointmentDetails(
        testVars.campusKey.pass,
        testVars.appointmentId.pass
        )
        .then(result => {
          expect(result).to.have.property('totalamount');
          expect(result).to.have.property('registrationdate');
          expect(result).to.have.property('email');
          expect(result).to.have.property('firstname');
          expect(result).to.have.property('lastname');
          expect(result).to.have.property('status');
          expect(result).to.have.property('items');
        });
    });
    it('Should fail because of client side validation', done => {
      const client = new Client(testVars.config.valid);
      client
        .getAppointmentDetails(testVars.campusKey.pass, 234235)
        .then(res => {
          console.log('THIS IS RES', res);
        })
        .catch(e => {
          const error = e;
          expect(error).to.equal('appointmentId should be a string');
          done();
        });
    });
    it('Should fail because of bad campus key', done => {
      const client = new Client(testVars.config.valid);
      client
        .getAppointmentDetails(
        testVars.campusKey.fail,
        testVars.appointmentId.pass
        )
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          expect(e).to.eql({});
          done();
        });
    });
    it('Should fail because of bad appointment Id', done => {
      const client = new Client(testVars.config.valid);
      client
        .getAppointmentDetails(
        testVars.campusKey.pass,
        testVars.appointmentId.fail
        )
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          expect(e).to.eql({});
          done();
        });
    });
  });
  describe('Should test getCampusDetails method', () => {
    it('Should work correctly', done => {
      const client = new Client({ url: url, token: testVars.token.pass });
      client.getCampusDetails(testVars.campusKey.pass).then(res => {
        const result = JSON.parse(res);
        expect(result).to.have.property('name');
        expect(result).to.have.property('address');
        expect(result).to.have.property('campuskey');
        expect(result).to.have.property('city');
        expect(result).to.have.property('email');
        expect(result).to.have.property('phone');
        expect(result).to.have.property('rbfee');
        expect(result).to.have.property('shortname');
        expect(result).to.have.property('state');
        expect(result).to.have.property('zip');
        expect(result).to.have.property('canceltext');
        done();
      });
    });
    it('Should fail because of client side validation', done => {
      const client = new Client({ url: url, token: 23423 });
      client
        .getCampusDetails(testVars.campusKey.pass)
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          const error = e;
          expect(error).to.equal('token type is not correct');
          done();
        });
    });
    it('Should fail because of bad token', done => {
      const client = new Client({ url: url, token: testVars.token.fail });
      client
        .getCampusDetails(testVars.campusKey.pass)
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          expect(JSON.parse(e)).to.deep.equal({});
          done();
        });
    });
    it('Should fail because of bad campus key', done => {
      const client = new Client({ url: url, token: testVars.token.pass });
      client
        .getCampusDetails(testVars.campusKey.fail)
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          expect(JSON.parse(e)).to.deep.equal({});
          done();
        });
    });
  });
});
