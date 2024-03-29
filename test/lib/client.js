console.log('loaded');
var testVars = {
  campusKey: { pass: 'correctCampusKey', fail: 'wrongCampusKey' },
  appointmentId: { pass: 'correctId', fail: 'wrongId' },
  token: { pass: 'correctToken', fail: 'wrongToken' }
};
var assert = require('chai').assert,
  expect = require('chai').expect,
  client = require('../../index'),
  url = 'http://localhost:8000';
require('./mock')(url);
describe('testing client lib for registerBlast endpoints', () => {
  describe('Should test cancelAppointment method', () => {
    it('Should work correctly', done => {
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .cancelAppointment(testVars.campusKey.pass, testVars.appointmentId.pass)
        .then(res => {
          var result = JSON.parse(res);
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
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .cancelAppointment(1231, testVars.appointmentId.pass)
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          var error = e;
          expect(error).to.equal('campusKey should be a string');
          done();
        });
    });
    it('Should fail because of bad token', done => {
      var c = new client({ url: url, token: testVars.token.fail });
      c
        .cancelAppointment(testVars.campusKey.pass, testVars.appointmentId.pass)
        .then(res => {
        })
        .catch(e => {
          var result = JSON.parse(e);
          expect(result).to.have.property('cancel');
          expect(result).to.have.property('message');
          expect(result.cancel).to.equal('error');
          expect(
            result.message
          ).to.equal('This registration may not be canceled online at this time.');
          done();
        });
    });
    it('Should fail because of bad campus key', done => {
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .cancelAppointment(testVars.campusKey.fail, testVars.appointmentId.pass)
        .then(res => {
        })
        .catch(e => {
          var result = JSON.parse(e);
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
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .cancelAppointment(testVars.campusKey.pass, testVars.appointmentId.fail)
        .then(res => {
        })
        .catch(e => {
          var result = JSON.parse(e);
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
    it('Should work correctly', done => {
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .getAppointmentDetails(
          testVars.campusKey.pass,
          testVars.appointmentId.pass
        )
        .then(res => {
          var result = JSON.parse(res);
          expect(result).to.have.property('totalamount');
          expect(result).to.have.property('registrationdate');
          expect(result).to.have.property('email');
          expect(result).to.have.property('firstname');
          expect(result).to.have.property('lastname');
          expect(result).to.have.property('status');
          expect(result).to.have.property('items');
          done();
        })
        .catch(e => {
          console.log(e);
        });
    });
    it('Should fail because of client side validation', done => {
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .getAppointmentDetails(testVars.campusKey.pass, 234235)
        .then(res => {
          console.log('THIS IS RES', res);
        })
        .catch(e => {
          var error = e;
          expect(error).to.equal('appointmentId should be a string');
          done();
        });
    });
    it('Should fail because of bad token', done => {
      var c = new client({ url: url, token: testVars.token.fail });
      c
        .getAppointmentDetails(
          testVars.campusKey.pass,
          testVars.appointmentId.pass
        )
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          expect(JSON.parse(e)).to.deep.equal({});
          done();
        });
    });
    it('Should fail because of bad campus key', done => {
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .getAppointmentDetails(
          testVars.campusKey.fail,
          testVars.appointmentId.pass
        )
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          expect(JSON.parse(e)).to.deep.equal({});
          done();
        });
    });
    it('Should fail because of bad appointment Id', done => {
      var c = new client({ url: url, token: testVars.token.pass });
      c
        .getAppointmentDetails(
          testVars.campusKey.pass,
          testVars.appointmentId.fail
        )
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          expect(JSON.parse(e)).to.deep.equal({});
          done();
        });
    });
  });
  describe('Should test getAppointmentDetails method', () => {
    it('Should work correctly', done => {
      var c = new client({ url: url, token: testVars.token.pass });
      c.getCampusDetails(testVars.campusKey.pass).then(res => {
        var result = JSON.parse(res);
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
      var c = new client({ url: url, token: 23423 });
      c
        .getCampusDetails(testVars.campusKey.pass)
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          var error = e;
          expect(error).to.equal('token type is not correct');
          done();
        });
    });
    it('Should fail because of bad token', done => {
      var c = new client({ url: url, token: testVars.token.fail });
      c
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
      var c = new client({ url: url, token: testVars.token.pass });
      c
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
