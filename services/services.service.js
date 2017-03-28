
var client = require('./../elasticsearch.config.js');
var Q = require('q');

var service = {};

service.getLogLevelCounts = getLogLevelCounts;
service.getTopHostNames = getTopHostNames;
service.getTopLogs = getTopLogs;

module.exports = service;


function getLogLevelCounts(){
    var deferred = Q.defer();
   
    client.search({
    	  index: 'kdslogs',
    	  type: 'YARN',
    	  body:{
		  "aggs": {
		        "loglevel": {
		          "terms": {
		            "field": "level"
		          }         
		        }
			  },

	        "query": {
	            "range" : {
	                "datetime" : {
	                	
	                	"gte": "2017-02-01", 
	                    "lte": "2018",
	                    "format": "yyyy-MM-dd||yyyy"
	                }
	            }
	        }
    	  }
    	}, function (err, response) {
    		deferred.resolve(response);
    	});
    return deferred.promise;
};

function getTopHostNames(){
    var deferred = Q.defer();
   
    client.search({
    	  index: 'kdslogs',
    	  type: 'YARN',
    	  body:{
    		  "aggs": {
			    "hostname": {
			      "terms": {
			        "field": "hostname"
			      },
			      "aggs": {
			        "loglevel": {
			          "terms": {
			            "field": "level"
			          }         
			        }
			      }
			    }
			  },

	        "query": {
	            "range" : {
	                "datetime" : {
	                	
	                	"gte": "2017-02-01", 
	                    "lte": "2018",
	                    "format": "yyyy-MM-dd||yyyy"
	                }
	            }
	        }
    	  }
    	}, function (err, response) {
    		deferred.resolve(response);
    	});
    return deferred.promise;
};

function getTopLogs(){
    var deferred = Q.defer();
   
    client.search({
    	  index: 'kdslogs',
    	  type: 'YARN',
    	  body:{
			  "aggs": {
				  "thread" : {
					  "nested" : {
			                "path" : "log"
			            },
			            "aggs" : {
			                "thread" : { "terms" : { "field" : "log.thread" } }
			            }
				  },
				  "fqcn" : {
					  "nested" : {
			                "path" : "log"
			            },
			            "aggs" : {
			                "fqcn" : { "terms" : { "field" : "log.fqcn" } }
			            }
				  }
			  },

	        "query": {
	            "range" : {
	                "datetime" : {
	                	
	                	"gte": "2015-02-01", 
	                    "lte": "2018",
	                    "format": "yyyy-MM-dd||yyyy"
	                }
	            }
	        }
    	  }
    	}, function (err, response) {
    		deferred.resolve(response);
    	});
    return deferred.promise;
};