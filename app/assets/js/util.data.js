function generateDonutChart(loglevel, value, total) {
	var donutConfig = $().c3ChartDefaults().getDefaultDonutConfig('A');
	donutConfig.bindto = '#chart-pf-donut-' + loglevel;
	donutConfig.color = {
		pattern : loglevel == 'info' ? [ "#4ABDAC", "#D1D1D1" ] : loglevel == 'error' ? [ "#FC4A1A", "#D1D1D1" ] : [ "#F7B733", "#D1D1D1" ]
	};
	donutConfig.data = {
		type : "donut",
		columns : [
			[ "Over total", value ],
			[ "Difference messages about the total", total - value ]
		],
		groups : [
			[ "level", "total" ]
		],
		order : null
	};

	donutConfig.tooltip = {
		contents : function(d) {
			var label = d[0].name == 'Over total' ? Math.round(d[0].ratio * 100) + '% ' + d[0].name : d[0].value + ' ' + d[0].name;
			return '<span class="donut-tooltip-pf" style="white-space: nowrap;">' + label + '</span>';

		}
	};

	var chart3 = c3.generate(donutConfig);
	var donutChartTitle = d3.select('#chart-pf-donut-' + loglevel).select('text.c3-chart-arcs-title');
	donutChartTitle.text("");
	donutChartTitle.insert('tspan').text(value).classed('donut-title-big-pf', true).attr('dy', 0).attr('x', 0);
	donutChartTitle.insert('tspan').text(loglevel).classed('donut-title-small-pf', true).attr('dy', 20).attr('x', 0);

}

function generateBarChart(values, hostnames, loglevel) {
	var c3ChartDefaults = $().c3ChartDefaults();


	var categories = hostnames;
	var columnsData = [ values ];

	var verticalBarChartConfig = $().c3ChartDefaults().getDefaultBarConfig(categories);
	verticalBarChartConfig.bindto = '#barchart-' + loglevel;
	verticalBarChartConfig.axis = {
		x : {
			categories : categories,
			type : 'category'
		}
	};
	verticalBarChartConfig.color = {
			pattern : loglevel == 'info' ? [ "#4ABDAC", "#D1D1D1" ] : loglevel == 'error' ? [ "#FC4A1A", "#D1D1D1" ] : [ "#F7B733", "#D1D1D1" ]
		};
	verticalBarChartConfig.size = {
		height : 275
	}
	verticalBarChartConfig.data = {
		type : 'bar',
		columns : columnsData
	};
	var verticalBarChart = c3.generate(verticalBarChartConfig);

}

function insertMissingLogData (data){
	var keys = ['error', 'info', 'warn'];
	var contains = false;
	for (var k in keys){
		contains = false;
		jQuery.each(data, function(i, loglevel) {
			if(keys[k] == loglevel.key){
				contains = true;
				return;
			}
				
		});
		if (!contains) data.push({ 'key': keys[k], 'doc_count': 0});
	}

	return data;
}
function generateStackedBars(id, data){
	  var c3ChartDefaults = $().c3ChartDefaults();

	  var stackedGroups = [['flume', 'zookeeper', 'yarn']];
	  

	  var xaxis = function (date){
		  var ini = new Date(new Date().setMinutes(0));
		  var fin = new Date(new Date().setHours(ini.getHours()+1));
		  fin = new Date(fin.setMinutes(0));
		  var dates = ['x'];
		  do{
			  var aux = new Date(ini.setMinutes(ini.getMinutes()+1));
			  dates.push(new Date(aux));
			  
		  }while(aux<fin);
		  
		  return dates;
	  }
	  var dates = xaxis(new Date());
	  data.push(dates);
	  var stackedVerticalBarChartConfig = c3ChartDefaults.getDefaultStackedBarConfig();
	  stackedVerticalBarChartConfig.axis= {
		        x: {
		            type: 'timeseries',
		            tick: {
		                format: '%H:%M'
		            },
		            
		            max: dates[61]
		        },
		        y: {
		            min: 0
		          }
		    }
	  stackedVerticalBarChartConfig.bindto = '#'+id;
	  stackedVerticalBarChartConfig.color = {
				pattern : pattern
			};
	  stackedVerticalBarChartConfig.data = {
	    columns: data,
	    groups: stackedGroups,
	    type: 'bar',
	    x:'x'
	    
	  };
	  var stackedVerticalBarChart = c3.generate(stackedVerticalBarChartConfig);
}
function generatePieChart(log, data) {
	var c3ChartDefaults = $().c3ChartDefaults();

	var colors = generateRandomColors(data);
	var pieData = {
		type : 'pie',
		colors : colors,
		columns : data
	};

	var pieChartRightConfig = c3ChartDefaults.getDefaultPieConfig();
	pieChartRightConfig.bindto = '#piechart-' + log;
	pieChartRightConfig.data = pieData;
	pieChartRightConfig.legend = {
		show : true,
		position :  'bottom'
	};
	pieChartRightConfig.size = {
		minwidth : log == 'thread' ? 450 : 550,
		maxwidth : log == 'thread' ? 450 : 550,
		minheight : log == 'thread' ? 300 : 300,
		maxheight : log == 'thread' ? 300 : 300
	};
	var pieChartRightLegend = c3.generate(pieChartRightConfig);


}
var pattern = [ '#FC4A1A', '#4ABDAC', '#F7B733', '#B37D43', '#E24E42', '#E9B000', '#008F95', '#EB6E80',"#3f9c35","#EC7A08" ,'#07889b','#e37222', '#CD5360'];

function generateRandomColors(data) {
	var ret = {};	
	var selected = [];
	for (var d in data) {
		var key = data[d][0];
		function generateRandom() {
			var cont = 0;
			do {
				var r = parseInt(Math.random() * pattern.length)
				cont ++;
			} while (selected.indexOf(r) != -1 || cont == 5)
			return r;
		}
		var random = generateRandom();
		selected.push(random);
		ret[key] = pattern[random];
	}
	return ret;
}

function generateLineChart (id, data){
	var splineChartConfig = $().c3ChartDefaults().getDefaultLineConfig();
	  splineChartConfig.bindto = '#'+id;

	  var xaxis = function (date){
		  var ini = new Date(new Date().setMinutes(0));
		  var fin = new Date(new Date().setHours(ini.getHours()+1));
		  fin = new Date(fin.setMinutes(0));
		  var dates = ['x'];
		  do{
			  var aux = new Date(ini.setMinutes(ini.getMinutes()+1));
			  dates.push(new Date(aux));
			  
		  }while(aux<fin);
		  
		  return dates;
	  }
	  var dates = xaxis(new Date());
	  data.push(dates);
	  splineChartConfig.data = {
			  	x: 'x',
			    columns: data,
			    type: 'spline'
			  };
	  
	  splineChartConfig.axis= {
		        x: {
		            type: 'timeseries',
		            tick: {
		                format: '%H:%M'
		            },
		            
		            max: dates[61]
		        },
		        y: {
		            min: 0
		          }
		    }
	 
	  splineChartConfig.color = {
				pattern : pattern
			};
	  var splineChart = c3.generate(splineChartConfig);
}

function generateSparkLineChart(id, data){
	
	  var c3ChartDefaults = $().c3ChartDefaults();
	  var sparklineChartConfig = c3ChartDefaults.getDefaultSparklineConfig();
	  sparklineChartConfig.bindto = '#'+id;
	  sparklineChartConfig.data = {
	    columns: data,
	    type: 'area'
	  };
	  var sparklineChart = c3.generate(sparklineChartConfig);

}