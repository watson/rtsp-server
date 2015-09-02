'use strict'

var util = require('util')
var stream = require('stream')
var STATUS_CODES = require('./status-codes')

var ServerResponse = module.exports = function (socket, opts) {
  if (!(this instanceof ServerResponse)) return new ServerResponse(socket, opts)
  stream.Writable.call(this, opts)
  this.socket = socket
  this.statusCode = 200
  this.headersSent = false
  this._headers = {}

  this.once('finish', function () {
    if (!this.headersSent) this.writeHead()
    this.socket.end()
  }.bind(this))
}

util.inherits(ServerResponse, stream.Writable)

ServerResponse.prototype._write = function (chunk, encoding, cb) {
  if (!this.headersSent) this.writeHead()
  this.socket.write(chunk, encoding, cb) // TODO: Implement back-preasure
}

ServerResponse.prototype.setHeader = function (name, value) {
  if (this.headersSent) throw new Error('Headers already sent!')
  this._headers[name] = value
}

ServerResponse.prototype.getHeader = function (name) {
  if (this.headersSent) throw new Error('Headers already sent!')
  return this._headers[name]
}

ServerResponse.prototype.removeHeader = function (name) {
  if (this.headersSent) throw new Error('Headers already sent!')
  delete this._headers[name]
}

ServerResponse.prototype.writeHead = function (statusCode, statusMessage, headers) {
  if (this.headersSent) throw new Error('Headers already sent!')
  if (typeof statusMessage === 'object') {
    headers = statusMessage
    statusMessage = null
  }

  if (statusCode) this.statusCode = statusCode

  if (headers) this._headers = headers
  this.statusMessage = statusMessage || this.statusMessage || STATUS_CODES[String(this.statusCode)]

  var statusLine = util.format('RTSP/1.0 %s %s\r\n', this.statusCode, this.statusMessage)
  this.socket.write(statusLine, 'utf8')

  var self = this
  Object.keys(this._headers).forEach(function (name) {
    var value = self._headers[name]
    if (!Array.isArray(value)) value = [value]
    value.forEach(function (value) {
      self.socket.write(util.format('%s: %s\r\n', name, value), 'utf8')
    })
  })

  this.socket.write('\r\n', 'utf8')
  this.headersSent = true
}
