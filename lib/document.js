var dedent = require('dedent')
var hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    'meta[name="viewport"]': {
      content: 'width=device-width, initial-scale=1, viewport-fit=cover'
    },
    head: {
      _prependHtml: dedent`
      <title>Thesis</title>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">  
      <link rel="manifest" href="manifest.json">
      `,
      _appendHtml: dedent`
        <link rel="shortcut icon" href="/favicon.ico">
      `
    }
  })
}