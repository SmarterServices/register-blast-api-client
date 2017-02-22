var request = require('request');

var client = function(config) {
  //base url path. ex. https://localhost:8000
  this.basePath = config.url;
  //token used for basic auth
  this.token = config.token;
};

/**
 * validate
 * @param  {Any} key  key to validate on
 * @param  {String} type type to validate against in string form, ie. Number,String
 * @return {Boolean}      true/false
 */
validate = function(key, type) {
  return !(typeof key === type);
};
/**
 * send takes a request object and callback adds basic auth token and sends the request
 * @param  {object}   requestObj request object
 * @param  {Function} callback   callback function
 * @return {callback}              callback
 */
client.prototype.send = function(requestObj, callback) {
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
client.prototype.cancelAppointment = function(campusKey, appointmentId) {
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
client.prototype.getAppointmentDetails = function(campusKey, appointmentId) {
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
client.prototype.getCampusDetails = function(campusKey) {
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
