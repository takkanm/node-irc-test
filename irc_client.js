var irc = require('irc');
var settings = require('./settings');
var sys = require('sys');


var client = new irc.Client(settings.irc.host, settings.irc.nick, settings.irc.opts);
client.addListener('error', function(message) {
	console.error('ERROR: %s: %s', message.command, message.args.join(' '));
});

client.on('message', function(from, to, message) {
	console.info(from + ' ' + to);
	client.send('NOTICE', to, 'hi');
});


process.on('uncaughtException', function(err) {
	console.log(err.toString());
});
