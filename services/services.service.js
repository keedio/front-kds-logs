
var client = require('./../elasticsearch.config.js');
var Q = require('q');

var service = {};

service.getLogLevelCounts = getLogLevelCounts;
service.getTopHostNames = getTopHostNames;
service.getTopLogs = getTopLogs;
service.getRealTimeLogLevelService = getRealTimeLogLevelService;
service.test = test;
module.exports = service;


function getLogLevelCounts(during, service) {
	var deferred = Q.defer();
	var dates = parseDates(during);
	client.search({
		index : 'kdslogs',
		type : service,
		body : {
			"aggs" : {
				"loglevel" : {
					"terms" : {
						"field" : "level"
					}
				}
			},

			"query" : {
				"range" : {
					"datetime" : {
						"gte" : dates[0],
						"lte" : dates[1],
						"format" : "yyyy-MM-dd HH:mm:ss|| yyyy-MM-dd HH:mm:ss"
					}
				}
			}
		}
	}, function(err, response) {
		deferred.resolve(response);
	});
	return deferred.promise;
}
;

function getTopHostNames(during, service) {
	var deferred = Q.defer();
	var dates = parseDates(during);
	client.search({
		index : 'kdslogs',
		type : service,
		body : {
			"aggs" : {
				"loglevel" : {
					"terms" : {
						"field" : "level"
					},
					"aggs" : {
						"hostname" : {
							"terms" : {
								"field" : "hostname"
							}
						}
					}
				}
			},

			"query" : {
				"range" : {
					"datetime" : {
						"gte" : dates[0],
						"lte" : dates[1],
						"format" : "yyyy-MM-dd HH:mm:ss"
					}
				}
			}
		}
	}, function(err, response) {
		deferred.resolve(response);
	});
	return deferred.promise;
}
;

function getRealTimeLogLevelService(service) {
	var deferred = Q.defer();
	Date.prototype.hourFormated = function() {
		var mm = this.getMonth() + 1;
		var dd = this.getDate();
		var HH = this.getHours();
		var MM = this.getMinutes();
		var ss = this.getSeconds();
		return [ this.getFullYear(), '-',
			(mm > 9 ? '' : '0') + mm, '-',
			(dd > 9 ? '' : '0') + dd, ' ',
			(HH > 9 ? '' : '0') + HH
		].join('');
	};
	var date = new Date().hourFormated();
	
	client.search({
		index : 'kdslogs',
		type : service,
		body : {
			"aggs" : {
				"loglevel" : {
					"terms" : {
						"field" : "level"
					},
					"aggs" : {
						"service_level_interval" : {
							"date_histogram" : {
								"field" : "datetime",
								"interval" : "1m",
								"format" : "yyyy-MM-dd HH:mm:ss",
								"min_doc_count" : 0
							}
						}
					}
				}
			},
			"query" : {
				"range" : {
					"datetime" : {
						"gte" : date,
						"format" : "yyyy-MM-dd HH"
					}
				}
			}
		}
	}, function(err, response) {
		deferred.resolve(response);
	});
	return deferred.promise;
}


function getTopLogs(during, service) {
	var deferred = Q.defer();
	var dates = parseDates(during);
	client.search({
		index : 'kdslogs',
		type : service,
		body : {
			"aggs" : {
				"thread" : {
					"nested" : {
						"path" : "log"
					},
					"aggs" : {
						"thread" : {
							"terms" : {
								"field" : "log.thread"
							}
						}
					}
				},
				"fqcn" : {
					"nested" : {
						"path" : "log"
					},
					"aggs" : {
						"fqcn" : {
							"terms" : {
								"field" : "log.fqcn"
							}
						}
					}
				}
			},

			"query" : {
				"range" : {
					"datetime" : {
						"gte" : dates[0],
						"lte" : dates[1],
						"format" : "yyyy-MM-dd HH:mm:ss|| yyyy-MM-dd HH:mm:ss"
					}
				}
			}
		}
	}, function(err, response) {
		deferred.resolve(response);
	});
	return deferred.promise;
}
;

function test(during, service) {
	var deferred = Q.defer();
	var dates = parseDates(during);
	client.search({
		index : 'kdslogs',
		type : service,
		body : {
			"aggs" : {
				"loglevel" : {
					"terms" : {
						"field" : "level"
					},
					"aggs" : {
						"service_level_interval" : {
							"date_histogram" : {
								"field" : "datetime",
								"interval" : "30s",
								"format" : "yyyy-MM-dd HH:mm:ss"
							}
						}
					}
				}
			},
			"query" : {
				"range" : {
					"datetime" : {
						"gte" : "2017-03-31 07",
						"format" : "yyyy-MM-dd HH"
					}
				}
			}
		}
	}, function(err, response) {
		deferred.resolve(response);
	});
	return deferred.promise;
}
;

function parseDates(during) {
	Date.prototype.formated = function() {
		var mm = this.getMonth() + 1;
		var dd = this.getDate();
		var HH = this.getHours();
		var MM = this.getMinutes();
		var ss = this.getSeconds();
		return [ this.getFullYear(), '-',
			(mm > 9 ? '' : '0') + mm, '-',
			(dd > 9 ? '' : '0') + dd, ' ',
			(HH > 9 ? '' : '0') + HH, ':',
			(MM > 9 ? '' : '0') + MM, ':',
			(ss > 9 ? '' : '0') + ss,
		].join('');
	};
	
	var from = new Date();
	var to = new Date().formated();
	switch (during) {
	case '1h':
		from = new Date().setHours(new Date().getHours() - 1)
		break;
	case '2h':
		from = new Date().setHours(new Date().getHours() - 2)
		break;
	case '6h':
		from = new Date().setHours(new Date().getHours() - 6)
		break;
	case '12h':
		from = new Date().setHours(new Date().getHours() - 12)
		break;
	case '24h':
		from = new Date().setHours(new Date().getHours() - 24)
		break;
	case '1w':
		from = new Date().setDate(new Date().getDate() - 7)
		break;
	case '1m':
		from = new Date().setMonth(new Date().getMonth() - 1)
		break;
	}

	return [ new Date(from).formated(), to ];
}