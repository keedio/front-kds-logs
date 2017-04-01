
var client = require('./elasticsearch.config.js');



getLogLevelCounts() ;


function getLogLevelCounts() {

	Date.prototype.formated = function() {
		var mm = this.getMonth() + 1;
		var dd = this.getDate();
		var HH = this.getHours()
		var MM = this.getMinutes();
		var ss = this.getSeconds()+1;
		return [ this.getFullYear(), '-',
			(mm > 9 ? '' : '0') + mm, '-',
			(dd > 9 ? '' : '0') + dd, ' ',
			(HH > 9 ? '' : '0') + HH, ':',
			(MM > 9 ? '' : '0') + MM, ':',
			(ss > 9 ? '' : '0') + ss, '.000'
		].join('');
	};
	var levels = [ 'ERROR', 'INFO', 'WARN' ];
	var services = ['zookeeper','flume','yarn'];
	var hostname = Math.floor((Math.random() * 10));
	client.create({
		index : 'kdslogs',
		type : services[Math.floor((Math.random() * 3))],
		id : guid(),
		body : {
			datetime : new Date().formated(),
			timezone : "+0000",
			hostname : "keedio"+ hostname,
			level : levels[Math.floor((Math.random() * 3))],
			log : {
				thread : "AsyncDispatcher event handler",
				fqcn : "org.apache.hadoop.yarn.server.resourcemanager.security.AMRMTokenSecretManager"+hostname,
				payload : "Application finished, removing password for appattempt_1490280386101_0002_000001"+hostname
			}
		}
	}, function(error, response) {
		console.log(response)
		setTimeout(getLogLevelCounts, 1000);
	});
	
};



function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}