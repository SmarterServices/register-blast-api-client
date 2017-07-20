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
  return new Promise(function getTokenPromise(resolve, reject) {
    let form = {
      username: this.username,
      password: this.password
    };

    let requestObj = {
      url: `${basePath}/login`,
      method: 'POST',
      headers:
      {
        'content-type': 'application/x-www-form-urlencoded',
        apikey: this.apiKey
      },
      form
    }

    let callback = function onResponse(err, res, body) {
      if (err) {
        reject(err);
      } else {
        if (body.success) {
          let currentTime = moment();
          this.tokenExpirationTime = currentTime.add(TOKEN_EXPIRATION_TIME_IN_MINUTES, 'm');

          this.token = body.token;
          resolve();
        } else {
          reject('Login failed');
        }
      }
    }

    request(requestObj, callback);
  })
}

client.prototype.getExamGroups = function getExamGroups(campusKey) {
  return new Promise(function getExamGroups(resolve, reject) {
    let remainingLoginAttempt = AUTO_LOGIN_ATTEMPT_LIMIT;

    let requestObj = {
      url: `${this.basePath}/campus/${campusKey}/groups`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${this.token}`,
        apikey: this.apiKey
      }
    }

    let currentTime = moment();

    let retry = function retry() {
      return this
        .login()
        .then(function onSuccess() {
          // Update request header with new authorization token
          requestObj.headers.authorization = `Bearer ${this.token}`;
          request(requestObj, callback);
        });
    }

    let callback = function onResponse(err, res, body) {
      if (err) {
        reject(err);
      } else if (body.error) {
        if (body.error === 'Expired' && --remainingLoginAttempt) {
          // Attempt login again if token is expired and there are attempts remaining
          retry();
        } else {
          reject(body.error);
        }
      } else if (!body.error) {
        resolve(body);
      }
    }

    if (currentTime > this.tokenExpirationTime) {
      retry();
    } else {
      request(requestObj, callback);
    }
  })
}
/**
 * send takes a request object and callback adds basic auth token and sends the request
 * @param  {object}   requestObj request object
 * @param  {Function} callback   callback function
 * @return {callback}              callback
 */
client.prototype.send = function (requestObj, callback) {
  return new Promise((resolve, reject) => {
    requestObj.headers = { Authorization: `Basic ${this.token}` };
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
    if (validate(this.token, 'string')) {
      return reject('token type is not correct');
    }
    var requestObj = {
      url: `${this.basePath}/campus/${campusKey}/appointments/${appointmentId}/cancel`,
      method: 'GET'
    };
    var callback = (err, body, res) => {
      return body.statusCode != 200 ? reject(res) : resolve(res);
    };
    this.send(requestObj, callback);
  });
};
/**
	 * getAppointmentDetails Returns the details for a single appointment.
	 * @param  {String} campusKey key that relates to a campus
	 * @param  {String} appointmentId id that relates to an appointment
	 * @return {Promise} resolves with appointment details or errors with reject
	 */
client.prototype.getAppointmentDetails = function (campusKey, appointmentId) {
  return new Promise((resolve, reject) => {
    if (validate(campusKey, 'string')) {
      return reject('campusKey should be a string');
    }
    if (validate(appointmentId, 'string')) {
      return reject('appointmentId should be a string');
    }
    if (validate(this.token, 'string')) {
      return reject('token type is not correct');
    }
    var requestObj = {
      url: `${this.basePath}/campus/${campusKey}/appointments/${appointmentId}`,
      method: 'GET'
    };
    var callback = (err, body, res) => {
      return body.statusCode != 200 ? reject(res) : resolve(res);
    };
    this.send(requestObj, callback);
  });
};
/**
	 * getCampusDetails Returns the dtails for a single campus
	 * @param  {String} campusKey key that relates to a campus
	 * @return {Promise} resolves with campus details or errors with reject
	 */
client.prototype.getCampusDetails = function (campusKey) {
  return new Promise((resolve, reject) => {
    if (validate(campusKey, 'string')) {
      return reject('campusKey should be a string');
    }
    if (validate(this.token, 'string')) {
      return reject('token type is not correct');
    }
    var requestObj = {
      url: `${this.basePath}/campus/${campusKey}/properties`,
      method: 'GET'
    };
    var callback = (err, body, res) => {
      return body.statusCode != 200 ? reject(res) : resolve(res);
    };
    this.send(requestObj, callback);
  });
};

module.exports = client;
