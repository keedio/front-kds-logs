

'use strict';

var app = angular.module('realTimeComponent', [
	'ngRoute',
	'services.service'
]);

app.component('realTimeComponent', {
	templateUrl : 'real-time/realtime.template.html',
	controller : [ 'ServicesService', '$interval', '$scope',
		function RealTimeController(ServicesService, $interval, $scope) {
			var self = this;

			var promise;
			initController();

			function initController() {
				function getAllServices() {
					var flume,
						zookeeper,
						flink,
						spark = [];
					ServicesService.GetRealTimeLogLevel('flume3')
						.then(function(data) {
							flume = parseData('flume', data);

							ServicesService.GetRealTimeLogLevel('zookeeper3')
								.then(function(data) {
									zookeeper = parseData('zookeeper', data);

									ServicesService.GetRealTimeLogLevel('spark')
										.then(function(data) {
											spark = parseData('spark', data);
											
											ServicesService.GetRealTimeLogLevel('flink')
											.then(function(data) {
												flink = parseData('flink', data);
	
												generateStackedBars('linechart-services-error', [ [ 'flume' ].concat(flume[0]), [ 'zookeeper' ].concat(zookeeper[0]), [ 'spark' ].concat(spark[0]),[ 'flink' ].concat(flink[0]) ]);
												generateStackedBars('linechart-services-info', [ [ 'flume' ].concat(flume[1]), [ 'zookeeper' ].concat(zookeeper[1]), [ 'spark' ].concat(spark[1]), [ 'flink' ].concat(flink[1]) ] );
												generateStackedBars('linechart-services-warn', [ [ 'flume' ].concat(flume[2]), [ 'zookeeper' ].concat(zookeeper[2]), [ 'spark' ].concat(spark[2]) ,[ 'flink' ].concat(flink[2]) ]);
	
												generateLineChart('linechart-flume', [ [ 'error' ].concat(flume[0]), [ 'info' ].concat(flume[1]), [ 'warn' ].concat(flume[2]) ]);
												generateLineChart('linechart-zookeeper', [ [ 'error' ].concat(zookeeper[0]), [ 'info' ].concat(zookeeper[1]), [ 'warn' ].concat(zookeeper[2]) ]);
												generateLineChart('linechart-spark', [ [ 'error' ].concat(spark[0]), [ 'info' ].concat(spark[1]), [ 'warn' ].concat(spark[2]) ]);
												generateLineChart('linechart-flink', [ [ 'error' ].concat(flink[0]), [ 'info' ].concat(flink[1]), [ 'warn' ].concat(flink[2]) ]);
	
												generateSparkLineChart('sparkline-error-flume', [ [ 'messages' ].concat(flume[0]) ]);
												generateSparkLineChart('sparkline-info-flume', [ [ 'messages' ].concat(flume[1]) ]);
												generateSparkLineChart('sparkline-warn-flume', [ [ 'messages' ].concat(flume[2]) ]);
	
												generateSparkLineChart('sparkline-error-zookeeper', [ [ 'messages' ].concat(zookeeper[0]) ]);
												generateSparkLineChart('sparkline-info-zookeeper', [ [ 'messages' ].concat(zookeeper[1]) ]);
												generateSparkLineChart('sparkline-warn-zookeeper', [ [ 'messages' ].concat(zookeeper[2]) ]);
	
												generateSparkLineChart('sparkline-error-spark', [ [ 'messages' ].concat(spark[0]) ]);
												generateSparkLineChart('sparkline-info-spark', [ [ 'messages' ].concat(spark[1]) ]);
												generateSparkLineChart('sparkline-warn-spark', [ [ 'messages' ].concat(spark[2]) ]);
												
												generateSparkLineChart('sparkline-error-flink', [ [ 'messages' ].concat(flink[0]) ]);
												generateSparkLineChart('sparkline-info-flink', [ [ 'messages' ].concat(flink[1]) ]);
												generateSparkLineChart('sparkline-warn-flink', [ [ 'messages' ].concat(flink[2]) ]);
											});
										});
								});
						});

				}
				getAllServices();

			}

			$scope.start = function() {
				$scope.stop();

				promise = $interval(initController, 10000);
			};

			$scope.stop = function() {
				$interval.cancel(promise);
			};
			$scope.$on('$destroy', function() {
				$scope.stop();
			});

			$scope.start();

			function parseData(service, data) {
				var buckets = data.aggregations.loglevel.buckets.length != 3 ? insertMissingLogData(data.aggregations.loglevel.buckets) : data.aggregations.loglevel.buckets;
				var values = [ [ 0 ], [ 0 ], [ 0 ] ];


				jQuery.each(buckets, function(i, loglevel) {
					if (loglevel.service_level_interval != undefined && loglevel.service_level_interval.buckets != undefined) {
						jQuery.each(loglevel.service_level_interval.buckets, function(j, service_level_interval) {
							var k = loglevel.key == 'info' ? 1 : loglevel.key == 'error' ? 0 : 2

							if (j == 0)
								values[k][0] = service_level_interval.doc_count;
							else values[k].push(service_level_interval.doc_count);

						});

					}
				});

				return values;
			}

		} ]
});