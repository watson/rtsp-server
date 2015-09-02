'use strict'

var regexp = /^([A-Z]+) ([^ ]+) RTSP\/(\d\.\d)[\r\n]*$/

// Format:
//   Method SP Request-URI SP HTTP-Version CRLF
// Example:
//   OPTIONS rtsp://example.com/media.mp4 RTSP/1.0
exports.parse = function (line) {
  var match = line.match(regexp)
  if (!match) throw new Error('Unknown RTSP Request-Line format')
  return {
    method: match[1],
    url: match[2],
    rtspVersion: match[3]
  }
}
