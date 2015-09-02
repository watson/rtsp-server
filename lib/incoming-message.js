'use strict'

var util = require('util')
var stream = require('stream')
var nextLine = require('next-line')
var httpHeaders = require('http-headers')
var requestLine = require('./request-line')

var eoh = /\r\n\r\n|\r\r|\n\n/ // End Of Header

var IncomingMessage = module.exports = function (socket, opts) {
  if (!(this instanceof IncomingMessage)) return new IncomingMessage(socket, opts)
  stream.Transform.call(this, opts)
  this.socket = socket
  this._headerBuffers = []
  this._inBody = false
}

util.inherits(IncomingMessage, stream.Transform)

IncomingMessage.prototype._transform = function (chunk, encoding, cb) {
  // if we found the body, just act as a PassThrough stream
  if (this._inBody) return cb(null, chunk)

  this._headerBuffers.push(chunk)

  // if not, look for the start of the body
  var match = chunk.toString().match(eoh)
  if (match) {
    this._inBody = true
    this._processHeaders()
    var startOfBody = match.index + match[0].length
    this.push(chunk.slice(startOfBody))
  }

  cb()
}

IncomingMessage.prototype._processHeaders = function () {
  var data = Buffer.concat(this._headerBuffers)
  delete this._headerBuffers

  var line = requestLine.parse(nextLine(data)())
  this.rtspVersion = line.rtspVersion
  this.method = line.method
  this.url = line.url
  this.headers = httpHeaders(data)

  this.emit('request', this)
}
