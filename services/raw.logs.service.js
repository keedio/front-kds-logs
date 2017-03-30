var client = require('./../elasticsearch.config.js');
var Q = require('q');

var service = {};

service.getRawLogsBy = getRawLogsBy;
service.getAllRawLogsBy = getAllRawLogsBy;

module.exports = service;

function getRawLogsBy(filters, from, size) {
	var deferred = Q.defer();
	filters = JSON.parse(filters)
	client.search({
		index : 'kdslogs',
		type : filters['service'],
		body : {
		    "from": from,
		    "size": size,
			"query" : {
				"constant_score" : {
					"filter" : {
						"bool" : {
							"must" : generatElasticsearchQuery(filters)						
						}
					}
				}
			}
		}
	}, function(err, response) {
		deferred.resolve(response);
	});

	return deferred.promise;

}
function  getAllRawLogsBy(filters) {
	var deferred = Q.defer();
	filters = JSON.parse(filters)
	client.search({
		index : 'kdslogs',
		type : filters['service'],
		body : {
			"query" : {
				"constant_score" : {
					"filter" : {
						"bool" : {
							"must" : generatElasticsearchQuery(filters)						
						}
					}
				}
			}
		}
	}, function(err, response) {
		deferred.resolve(response);
	});

	return deferred.promise;
}

function generatElasticsearchQuery(filters){
	var obj = []
	
	for (var filter in filters){
		
		if(filter == 'loglevel')
			obj.push ({"terms":  {"level": filters[filter] }})
		else if(filter == "log.thread" || filter == "log.fqcn"|| filter == "log.payload")
			obj.push ({"nested" : {"path" : "log","query" : {	"wildcard" : {[filter] : "*"+filters[filter]+"*"}}}})
		else if(filter == 'datetime')
			obj.push({"range": {"datetime" : {"gte" : new Date(filters[filter][0]).toISOString().substr(0,10),	"lte" : new Date(filters[filter][1]).toISOString().substr(0,10),"format" : "yyyy-MM-dd||yyyy-MM-dd"	}}})
	}	
	return obj;
}