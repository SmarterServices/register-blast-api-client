'use strict';

const request = require('request');
const moment = require('moment');

const TOKEN_EXPIRATION_TIME_IN_MINUTES = 15;
const AUTO_LOGIN_ATTEMPT_LIMIT = 2;

const client = function (config) {
  //base url path. ex. https://localhost:8000
  this.basePath = config.url;

  //token used for basic auth
  this.token = config.token;

  //api key for client
  this.apiKey = config.apiKey;

  // Credentials
  this.username = config.username;
  this.password = config.password;
};

/**
 * validate
 * @param  {Any} key  key to validate on
 * @param  {String} type type to validate against in string form, ie. Number,String
 * @return {Boolean}      true/false
 */
let validate = function (key, type) {
  return !(typeof key === type);
};

/**
 * Get a token for username and password and store it as a member variable
 * @param {string} username
 * @param {string} password
 */
client.prototype.login = function login() {
  let _this = this;
  return new Promise(function getTokenPromise(resolve, reject) {
    let form = {
      username: _this.username,
      password: _this.password
    };

    let requestObj = {
      url: `${_this.basePath}/login`,
      method: 'POST',
      headers:
      {
        'content-type': 'application/x-www-form-urlencoded',
        apikey: _this.apiKey
      },
      form
    };

    let callback = function onResponse(err, res, body) {
      err,body
      if (err) {
        reject(err);
      } else {
        body = JSON.parse(body);
        if (body.success) {
          let currentTime = moment();
          _this.tokenExpirationTime = currentTime.add(TOKEN_EXPIRATION_TIME_IN_MINUTES, 'm');

          _this.token = body.token;
          resolve();
        } else {
          reject('Login failed');
        }
      }
    }

    request(requestObj, callback);
  })
}

/**
 * Get exam groups for a proctor
 * @param {string} campusKey
 */
client.prototype.getExamGroups = function getExamGroups(campusKey) {
  let _this = this;
  return new Promise(function getExamGroups(resolve, reject) {
    if (validate(campusKey, 'string')) {
      return reject('campusKey should be a string');
    }

    let requestObj = {
      url: `${_this.basePath}/campus/${campusKey}/groups`,
      method: 'GET',
      headers: {
        authorization: `Basic ${_this.token}`,
        apikey: _this.apiKey
      }
    }

    _this.requestWithAutoLogin(requestObj, resolve, reject);
  })
}

/**
 * send takes a request object and callback adds basic auth token and sends the request
 * @param  {object}   requestObj request object
 * @param  {Function} callback   callback function
 * @return {callback}              callback
 */
client.prototype.send = function (requestObj, callback) {
  let _this  = this;
  return new Promise((resolve, reject) => {
    requestObj.headers = {
     authorization: `Basic ${this.token}`,
     apikey: _this.apiKey
   };
    request(requestObj, callback);
  });
};
/**
   * cancelAppointment cancels an exam for the RegisterBlast system.
   * @param  {String} campusKey     key that relates to a campus
   * @param  {String} appointmentId id that relates to an appointment
   * @return {Promise} resolves if deleted correctly rejects if error
   */
client.prototype.cancelAppointment = function (campusKey, appointmentId) {
  return new Promise((resolve, reject) => {
    if (validate(campusKey, 'string')) {
      return reject('campusKey should be a string');
    }
    if (validate(appointmentId, 'string')) {
      return reject('appointmentId should be a string');
    }

    this._getCancelResponse(campusKey, appointmentId)
      .then(response => {
        return response.cancel === 'success'
          ? resolve(response)
          : reject(response);
      })
      .catch(reject);
  });
};

client.prototype._getCancelResponse = function getCancelResponse(campusKey, appointmentId) {
  return new Promise((resolve, reject) => {
    var requestObj = {
      url: `${this.basePath}/campus/${campusKey}/appointments/${appointmentId}/cancel`,
      method: 'GET'
    };
    this.requestWithAutoLogin(requestObj, resolve, reject);
  })
}
/**
   * getAppointmentDetails Returns the details for a single appointment.
   * @param  {String} campusKey key that relates to a campus
   * @param  {String} appointmentId id that relates to an appointment
   * @return {Promise} resolves with appointment details or errors with reject
   */
client.prototype.getAppointmentDetails = function (campusKey, appointmentId) {
  const _this = this;
  return new Promise((resolve, reject) => {
    if (validate(campusKey, 'string')) {
      return reject('campusKey should be a string');
    }
    if (validate(appointmentId, 'string')) {
      return reject('appointmentId should be a string');
    }
    var requestObj = {
      url: `${this.basePath}/campus/${campusKey}/appointments/${appointmentId}`,
      method: 'GET',
      headers: {
        authorization: `Basic ${_this.token}`,
        apikey: _this.apiKey
      }
    };
    _this.requestWithAutoLogin(requestObj, resolve, reject);
  });
};
//
//
client.prototype.updateAppointmentDetails = function (campusKey, appointmentId, body) {
  let _this = this
  return new Promise((resolve, reject) => {
    if (validate(campusKey, 'string')) {
      return reject('campusKey should be a string');
    }
    if (validate(appointmentId, 'string')) {
      return reject('appointmentId should be a string');
    }
    var requestObj = {
      url: `${this.basePath}/campus/${campusKey}/appointments/${appointmentId}`,
      method: 'POST',
      json: body,
      headers: {
        authorization: `Bearer ${_this.token}`,
        apikey: _this.apiKey
      }
    };
    this.requestWithAutoLogin(requestObj, resolve, reject, true);
  });
};

/**
   * getAvailability Returns all the appointment times for a set of exam group keys.
   * @param  {Object} body     Object that holds all the data for the request.
   * @param  {String} body.startDate the start date for the first potential appointment slot.
   * @param  {String} body.endDate the end date for the last potential appointment slot.
   * @param  {Array} body.examGroups the exam groups that should be looked up.
   * @param  {Number} body.duration the duration of the exam.
   * @return {Promise} resolves with an object that includes an availability array of objects of all the start times.
   */

client.prototype.getAvailability = function (body) {
  let _this = this

  return new Promise((resolve, reject) => {

    if (validate(body.startDate, 'string')) {
      return reject('startDate should be a string');
    }
    if (validate(body.endDate, 'string')) {
      return reject('endDate should be a string');
    }
    if (!Array.isArray(body.examGroups)) {
      return reject('examGroups should be an array.');
    }
    if (body.examGroups.length === 0) {
      return reject('examGroups be an array with at least 1 item.');
    }
    if (validate(body.duration, 'number')) {
      return reject('duration should be a number');
    }

    var requestObj = {
      url: `${this.basePath}/campus/availability`,
      method: 'POST',
      json: body,
      headers: {
        authorization: `Bearer ${_this.token}`,
        apikey: _this.apiKey
      }
    };
    this.requestWithAutoLogin(requestObj, resolve, reject, true);
  });
};
/**
   * getCampusDetails Returns the dtails for a single campus
   * @param  {String} campusKey key that relates to a campus
   * @return {Promise} resolves with campus details or errors with reject
   */
client.prototype.getCampusDetails = function (campusKey) {
  let _this = this;
  return new Promise((resolve, reject) => {
    let remainingLoginAttempt = AUTO_LOGIN_ATTEMPT_LIMIT;
    if (validate(campusKey, 'string')) {
      return reject('campusKey should be a string');
    }
    var requestObj = {
      url: `${this.basePath}/campus/${campusKey}/properties`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${_this.token}`,
        apikey: _this.apiKey
      }
    };
    let currentTime = moment();

    let requestWithLogin = function requestWithLogin() {
      return _this
        .login()
        .then(function onSuccess() {
          // Update request header with new authorization token
          requestObj.headers.authorization = `Bearer ${_this.token}`;
          requestObj.headers.apikey =  _this.apiKey
          request(requestObj, callback);
        });
    }

    let callback = function onResponse(err, res, body) {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return reject(err);
      }
      if (err) {
        reject(err);
      } else if (body.error) {
        if (body.error === 'Expired' && --remainingLoginAttempt) {
          // Attempt login again if token is expired and there are attempts remaining
          requestWithLogin();
        } else {
          reject(body.error);
        }
      } else if (!body.error) {
        resolve(body);
      }
    };

    if (!_this.token || currentTime > _this.tokenExpirationTime) {
      requestWithLogin();
    } else {
      request(requestObj, callback);
    }
  });
};

/**
 * Send http request with auto login attempt support if token is expired or not available
 * @param {object} requestObj
 */
client.prototype.requestWithAutoLogin = function requestWithAutoLogin(requestObj, resolve, reject, skipJsonParsing) {
  let config = {
    remainingLoginAttempt: AUTO_LOGIN_ATTEMPT_LIMIT,
    resolve: resolve,
    reject: reject
  };

  requestObj.headers = Object.assign({}, requestObj.headers, {
    authorization: `Basic ${this.token}`,
    apikey: this.apiKey
  });

  let currentTime = moment();

  const isTokenInvalid = !this.token ||
      !this.tokenExpirationTime ||
      currentTime > this.tokenExpirationTime;

  if (isTokenInvalid) {
    return this.requestWithLogin(requestObj, this.getAutoLoginCallback(requestObj, config, skipJsonParsing));
  } else {
    return request(requestObj, this.getAutoLoginCallback(requestObj, config, skipJsonParsing));
  }
}

/**
 * Get the request callback for requestWithAutoLogin method
 * @param {object} requestObj
 * @param {number} remainingLoginAttempt
 * @return {callback}
 */
client.prototype.getAutoLoginCallback = function getAutoLoginCallback(requestObj, config, skipJsonParsing) {
  let _this = this;
  return function onResponse(err, res, body) {
    if (!skipJsonParsing) {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return config.reject(err);
      }
    }

    if (err) {
      return config.reject(err);
    } else if (body.error) {
      if (body.error === 'Expired' && --config.remainingLoginAttempt) {
        // Attempt login again if token is expired and there are attempts remaining
        _this.requestWithLogin(requestObj);
      } else {
        return config.reject(body.error);
      }
    } else if (res.statusCode >= 400) {
      return config.reject(body);
    } else {
      return config.resolve(body);
    }
  };
}

/**
 * Send a request after logging in with stored username and password
 * @param {object} requestObj
 * @return {Promise}
 */
client.prototype.requestWithLogin = function requestWithLogin(requestObj, callback) {
  let _this = this;

  return _this
    .login()
    .then(function onSuccess() {
      // Update request header with new authorization token
      requestObj.headers.authorization = `Basic ${_this.token}`;
      requestObj.headers.apikey = _this.apiKey;
      request(requestObj, callback);
    })
}

module.exports = client;
