'use strict';

const qs = require('qs');
const nock = require('nock');
const setUpMock = function (url) {
  //login mocks
  nock(url)
    .persist()
    .post('/login')
    .reply(function (url, requestBody) {
      const body = qs.parse(requestBody)
      const isValidApiKey = this.req.headers['apikey'] === 'valid';
      const isValidLogin = body.username === 'admin' && body.password === 'password';

      if (!isValidApiKey) {
        return [200, {
          success: false,
          error: "Invalid client"
        }]
      } else if (!isValidLogin) {
        return [200, {
          success: false,
          error: "Invalid login"
        }]
      } else {
        return [200, {
          success: true,
          token: 'correctToken'
        }]
      }
    });
  //cancelAppointment mocks
  //success
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/correctCampusKey/appointments/correctId/cancel')
    .reply(200, 'done');
  // bad token
  nock(url, { reqheaders: { authorization: 'Basic wrongToken' } })
    .get('/campus/correctCampusKey/appointments/correctId/cancel')
    .reply(401, <html></html>);
  //bad campus key
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/wrongCampusKey/appointments/correctId/cancel')
    .reply(400, {
      cancel: 'error',
      message: 'This registration may not be canceled online at this time.'
    });
  //bad appointmentId
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/correctCampusKey/appointments/wrongId/cancel')
    .reply(400, {
      cancel: 'error',
      message: 'This registration may not be canceled online at this time.'
    });
  //getAppointmentDetails mock
  //success
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/correctCampusKey/appointments/correctId')
    .reply(200, {
      totalamount: 0,
      registrationdate: 1487367351,
      email: 'dbertucc@email',
      firstname: 'David',
      lastname: 'Smith',
      status: 'approved',
      items: [
        {
          campusamount: 0,
          examdate: 1490794200,
          deleted: false,
          examid: 49809,
          examname: 'SmarterProctoring',
          noshow: false,
          notes: null,
          partneramount: 0,
          refund: 0,
          registerblastamount: 0,
          incidents: []
        }
      ]
    });
  //bad token
  nock(url, { reqheaders: { authorization: 'Basic wrongToken' } })
    .get('/campus/correctCampusKey/appointments/correctId')
    .reply(401, {});
  //bad campusKey
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/wrongCampusKey/appointments/correctId')
    .reply(400, {});
  //bad appointmentId
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/correctCampusKey/appointments/wrongId')
    .reply(400, {});
  //getCampusDetails mock
  //success
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/correctCampusKey/properties')
    .reply(200, {
      name: 'Moorhead',
      address: 'Cherry Street',
      campuskey: 351,
      city: 'Moorhead',
      email: 'vccdlc@msdelta.edu',
      phone: '662-745-6322',
      rbfee: 0,
      shortname: 'morehead',
      state: 'MS',
      zip: '38761',
      canceltext: 'If your registration is eligible for online canceling, you may click <a href="https://www.registerblast.com/morehead/History">here</a> to begin the process.  If your registration is not eligible for online canceling, please contact your testing center.'
    });
  //bad token
  nock(url, { reqheaders: { authorization: 'Basic wrongToken' } })
    .get('/campus/correctCampusKey/properties')
    .reply(401, {});
  //bad campusKey
  nock(url, { reqheaders: { authorization: 'Basic correctToken' } })
    .get('/campus/wrongCampusKey/properties')
    .reply(400, {});
};

module.exports = setUpMock;
