

'use strict';

var app = angular.module('rawLogs', [
    'ngRoute',
    'raw.logs.service'
]);

app.component('rawLogs',{
    templateUrl: 'raw-logs/raw-logs.template.html',
    controller: ['RawLogsService',
        function RawLogsController (RawLogsService) {
            var self = this;

            
            self.logLevel  = {
                availableOptions: [
                    {id: -1, name: 'Nothing selected'},
                    {id: 'error', name: 'Error'},
                    {id: 'info', name: 'Info'},
                    {id: 'warn', name: 'Warning'}
                ]
            };
            self.servicesEntries  = {
                availableOptions: [
                    {id: 'yarn', name: 'Yarn'},
                    {id: 'zookeeper', name: 'Zookeeper'},
                    {id: 'flume', name: 'Flume'},
                ],
                selectedOption : {
					id : 'yarn',
					name : 'Yarn'
				}
            };

            self.payLoad = "";
            self.dateFrom = "";
            self.dateTo = "";
            self.thread = "";
            self.fqcn = "";
            self.activeFilters= {};
            self.actualIndex = 0;
            self.size = 10;
           
          

            self.getRawLogsBy = function  () {
                var filters = serializeForm();
                RawLogsService.GetRawLogsBy(filters, 0, self.size).then(function ( data) {
                    self.rawlogs =  data.hits.hits;
  
                    self.actualIndex = self.size;
                    self.activeFilters = getActiveFilters(filters);

                });
            }

            self.next = function () {

                RawLogsService.GetRawLogsBy(serializeForm(), self.actualIndex, self.size).then(function (data) {
                	if(data.hits.hits.length >0){
            		   self.rawlogs =  data.hits.hits;
                       self.actualIndex += self.size;
                	}               

                });

            }

            self.previous = function () {

                RawLogsService.GetRawLogsBy(serializeForm(), self.actualIndex- (self.size*2), self.size).then(function (data) {
                    self.rawlogs =  data.hits.hits;
                    self.actualIndex -= self.size;
                });

            }

            self.loglevelClass = function(loglevel) {

                return loglevel === 'ERROR' ? "pficon pficon-error-circle-o" : loglevel === 'WARN' ?  "pficon pficon-warning-triangle-o " : "pficon pficon-ok";
            }

            self.removeFilter = function(filter ) {

                switch(filter) {
                    case 'loglevel':
                        self.logLevel.selectedOption = undefined;
                        $("#loglevelSelect").selectpicker('val', -1);
                        break;
                    case 'service':
                        self.servicesEntries.selectedOption =  { id : 'YARN', name : 'Yarn' };
                        $("#serviceSelect").selectpicker('val', 'YARN');
                        break;
                    case 'log.fqcn':
                        self.fqcn = '';
                        break;
                    case 'log.thread':
                        self.thread = '';
                        break;
                    case 'date':
                        self.dateFrom = '';
                        self.dateTo = '';
                        break;
                    case 'log.payload':
                        self.payLoad = '';
                        break;
                }
                self.getRawLogsBy();

            }

            self.export = function  () {
                var filters = serializeForm();
                RawLogsService.ExportRawLogs(filters).then(function ( report) {
                    var blob = new Blob([report], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    var objectUrl = URL.createObjectURL(blob);
                    window.open(objectUrl);
                });
            }

            function splitSelectedOtions(data) {

                var array = []
                for (var i in data)
                    array.push(  data[i].id )
                return array
            }

            function serializeForm(){
                return  {
                  
                    loglevel : self.logLevel.selectedOption != undefined && self.logLevel.selectedOption != '' ? splitSelectedOtions(self.logLevel.selectedOption) : undefined,                  
                    service : self.servicesEntries.selectedOption != undefined && self.servicesEntries.selectedOption != ''? self.servicesEntries.selectedOption.id : undefined,
                    'log.payload' : self.payLoad != '' ? self.payLoad : undefined,
                    'log.thread' : self.thread != '' ? self.thread : undefined,
                    'log.fqcn' : self.fqcn != '' ? self.fqcn : undefined,
                    datetime : self.dateFrom != '' &&  self.dateTo != '' ? [  self.dateFrom , self.dateTo ] : undefined

                };
            }

            function getActiveFilters(filters){
                var ret = [];
                for (var filter in filters )
                    if(filters[filter] != undefined && filters[filter] != '' && filter != 'service') ret.push({"name": filter, "values": filters[filter].toString()})

                return ret;
            }

        }]
});

app.directive('selectRawLogsGroup', selectDirective);

function selectDirective($timeout) {
	return {
		restrict : 'E',
		templateUrl : 'raw-logs/select.template.html',

		link : function(scope, element) {
			$timeout(function() {
				$('.selectpicker').selectpicker();
			});
		}
	}
}
