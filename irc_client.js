var irc = require('irc');
var settings = require('./settings');
var sys = require('sys');

function printPrompt() {
  sys.print('$ ');
}

var client = new irc.Client(settings.irc.host, settings.irc.nick, settings.irc.opts);
client.addListener('error', function(message) {
  console.error('ERROR: %s: %s', message.command, message.args.join(' '));
  printPrompt();
});

var toMyMessageRegexp = new RegExp("^" + settings.irc.nick + ": ");

client.on('message', function(from, to, message) {
  console.info('');
  console.info('-- ' +from + ' ' + to + ' ' + message);
  if (message.match(toMyMessageRegexp)) {
    setTimeout(function() {
      client.send('NOTICE', to, message.replace(toMyMessageRegexp, ''));
    }, 500);
  }

  printPrompt();
});

process.stdin.resume();
process.stdin.setEncoding('utf8');

function messageSend(message) {
  console.info(message);
  settings.irc.opts.channels.forEach(function(channel) {
    client.send('NOTICE', channel, message);
  });
}

function messageAction(message) {
  if (message == 'exit') {
    process.exit(0);
  }

  messageSend(message);
}

process.stdin.on('data', function (chunk) {
  message = chunk.toString('utf8').replace(/[\n\r]*$/, '');

  if (message.length != 0) {
    messageAction(message);
  }
  printPrompt();
});

process.on('exit', function() {
  console.log('bye!');
});

process.on('uncaughtException', function(err) {
  console.log(err.toString());
  printPrompt();
});

setTimeout(function() {
  printPrompt();
}, 500);
