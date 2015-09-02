'use strict'

// Each method operate on either a presentaion (P) or a stream (S)
//
// Check RFC 2326 section 10 for details:
// https://tools.ietf.org/html/rfc2326#page-29

module.exports = [ // RFC implementation guide:
  'ANNOUNCE',      // optional (P,S)
  'GET_PARAMETER', // optional (P,S)
  'OPTIONS',       // optional (P,S)
  'REDIRECT',      // optional (P,S)
  'SET_PARAMETER'  // optional (P,S)
]
