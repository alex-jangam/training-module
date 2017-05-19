var nolog = function () {}, env, hostname
try {
	hostname = require("os").hostname();
} catch (e) {
		hostname = window.location.hostname;
}

function consoleProto(key) {

	var ncon = console[key], newLog = ncon && console[key].bind(console);
	if (!newLog) {
			return nolog
	}
	if (Function.prototype.bind) {
		newLog = Function.prototype.bind.call(console[key], console);
	} else {
		newLog = function () {
			Function.prototype.apply.call(console[key], console, arguments);
		};
	}
	return newLog;
}


module.exports = {
	log: consoleProto("log"),
	warn: consoleProto("warn"),
	error: consoleProto("error"),
	debug: consoleProto("debug"),
	enableHosts: function () {
		for (var args = [], i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		if (!args.includes(hostname)) {
				this.log = nolog;
				this.warn = nolog;
				this.error = nolog;
		}
	}
};
