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
      apiKey: 'invalid',
      username: 'admin',
      password: 'password'
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
  }
};
