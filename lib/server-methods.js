'use strict'

// If a method isn't supported in a partictular implementation, the server must
// return 501 Not Implemented.
//
// Each method operate on either a presentaion (P) or a stream (S)
//
// Check RFC 2326 section 10 for details:
// https://tools.ietf.org/html/rfc2326#page-29

module.exports = [ // RFC implementation guide:
  'DESCRIBE',      // recommended (P,S)
  'ANNOUNCE',      // optional    (P,S)
  'GET_PARAMETER', // optional    (P,S)
  'OPTIONS',       // required    (P,S)
  'PAUSE',         // recommended (P,S)
  'PLAY',          // required    (P,S)
  'RECORD',        // optional    (P,S)
  'SETUP',         // required    (S)
  'SET_PARAMETER', // optional    (P,S)
  'TEARDOWN'       // required    (P,S)
]
