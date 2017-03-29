
var express = require('express');
var router = express.Router();
var rawLogServices = require('../services/raw.logs.service');
var excel = require('node-excel-export');


router.get('/getRawLogsBy', getRawLogsBy);
router.get('/exportRawLogs', exportRawLogs);
module.exports = router;


function getRawLogsBy(req, res) {
	 
    rawLogServices.getRawLogsBy(req.query.filters, req.query.from, req.query.size)
        .then(function (data) {
            if (data)
                res.send(data);
            else
                res.sendStatus(404);

        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}



function exportRawLogs(req, res) {
    rawLogServices.getAllRawLogsBy(req.query.filters)
        .then(function (data) {
        	
            if (data.hits.hits.length>0){
                var report = generateReport (data.hits.hits);
                res.attachment('raw_logs_report'+ new Date().toISOString() +'.xlsx');
                res.send(report);
            }

            else
                res.sendStatus(404);

        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function generateReport(data){
	var parsedData = [];
	for (var i in data)
		parsedData.push(data[i]._source);
	
    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    var specification = {
        level: { // <- the key should match the actual data key
            displayName: 'Log Level', // <- Here you specify the column header
            headerStyle: styles.headerDark,
            width: 120
        },
        datetime: {
            displayName: 'Date',
            headerStyle: styles.headerDark,
            width: 150 // <- width in chars (when the number is passed as string)
        },
        
       'log.thread': {
            displayName: 'Thread',
            headerStyle: styles.headerDark,
            width: 220 // <- width in pixels
        },
        'log.fqcn': {
            displayName: 'Fqcn',
            headerStyle: styles.headerDark,
            width: 220 // <- width in pixels
        },
        'log.payload': {
            displayName: 'Payload',
            headerStyle: styles.headerDark,
            width: 350 // <- width in pixels
        }
    }


    var report = excel.buildExport(
        [
            {
                name: 'Raw Logs',
                specification: specification,
                data: parsedData
            }
        ]
    );

    return report;

}