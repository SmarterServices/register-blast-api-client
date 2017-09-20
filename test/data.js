'use strict';

module.exports = {
  config: {
    valid: {
      url: 'http://localhost:8000',
      apiKey: 'valid',
      username: 'admin',
      password: 'password'
    },
    invalidApiKey: {
      url: 'http://localhost:8000',
      apiKey: 'invalid',
      username: 'admin',
      password: 'password'
    },
    invalidCredential: {
      url: 'http://localhost:8000',
      apiKey: 'valid',
      username: 'admin',
      password: 'pass'
    }
  },
  campusKey: {
    pass: 'correctCampusKey',
    fail: 'wrongCampusKey'
  },
  appointmentId: {
    pass: 'correctId',
    fail: 'wrongId'
  },
  token: {
    pass: 'correctToken',
    fail: 'wrongToken'
  },
  examGroups: {
    correctCampusKey: [
      {
        "id": "2196",
        "name": "CASTLE",
        "fullname": "CASTLE",
        "parentid": 0
      },
      {
        "id": "2194",
        "name": "CLEP",
        "fullname": "CLEP",
        "parentid": 0
      },
      {
        "id": "2195",
        "name": "MAT",
        "fullname": "MAT",
        "parentid": 0
      },
      {
        "id": "121568",
        "name": "SmarterProctoring",
        "fullname": "SmarterProctoring",
        "parentid": 0
      }
    ],
    wrongCampusKey: {
      "success": false,
      "error": "Invalid Campus"
    }
  }
};
