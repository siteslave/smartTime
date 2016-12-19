const _ = require('lodash');

let data = [
		{
		"employee_code": "1057",
		"date_serve": "2016-11-02",
		"service_type": "3",
		"in_morning": null,
		"in_afternoon": null,
		"in_evening": "23:49:04",
		"in_evening2": null,
		"out_morning": null,
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": "08:21:21"
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-03",
		"service_type": "3",
		"in_morning": null,
		"in_afternoon": null,
		"in_evening": null,
		"in_evening2": "00:00:00",
		"out_morning": null,
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": "08:28:46"
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-05",
		"service_type": "3",
		"in_morning": null,
		"in_afternoon": null,
		"in_evening": "23:50:19",
		"in_evening2": null,
		"out_morning": null,
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": "08:28:17"
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-08",
		"service_type": "1",
		"in_morning": "07:58:59",
		"in_afternoon": null,
		"in_evening": null,
		"in_evening2": null,
		"out_morning": "16:02:23",
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": null
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-09",
		"service_type": "1",
		"in_morning": "07:52:24",
		"in_afternoon": null,
		"in_evening": null,
		"in_evening2": null,
		"out_morning": "16:01:06",
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": null
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-10",
		"service_type": "1",
		"in_morning": "08:03:22",
		"in_afternoon": null,
		"in_evening": null,
		"in_evening2": null,
		"out_morning": "16:00:44",
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": null
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-10",
		"service_type": "3",
		"in_morning": null,
		"in_afternoon": null,
		"in_evening": "23:58:13",
		"in_evening2": null,
		"out_morning": null,
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": "08:39:55"
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-11",
		"service_type": "3",
		"in_morning": null,
		"in_afternoon": null,
		"in_evening": "23:52:49",
		"in_evening2": null,
		"out_morning": null,
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": "08:08:20"
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-15",
		"service_type": "1",
		"in_morning": "08:06:48",
		"in_afternoon": null,
		"in_evening": null,
		"in_evening2": null,
		"out_morning": "16:21:31",
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": null
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-16",
		"service_type": "1",
		"in_morning": "08:01:50",
		"in_afternoon": null,
		"in_evening": null,
		"in_evening2": null,
		"out_morning": "16:07:41",
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": null
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-16",
		"service_type": "3",
		"in_morning": null,
		"in_afternoon": null,
		"in_evening": "23:56:25",
		"in_evening2": null,
		"out_morning": null,
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": "08:15:05"
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-18",
		"service_type": "1",
		"in_morning": "08:09:43",
		"in_afternoon": null,
		"in_evening": null,
		"in_evening2": null,
		"out_morning": "16:00:28",
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": null
		},
		{
		"employee_code": "1057",
		"date_serve": "2016-11-18",
		"service_type": "3",
		"in_morning": null,
		"in_afternoon": null,
		"in_evening": "23:59:24",
		"in_evening2": null,
		"out_morning": null,
		"out_afternoon": null,
		"out_afternoon2": null,
		"out_evening": "08:20:35"
		}
];

let _data = _.uniqBy(data, "date_serve");
let results = [];

_data.forEach(v => {
	let obj = {};
	obj.date_serve = v.date_serve;
	data.forEach(x => {
		if (x.date_serve == v.date_serve) {
			if (x.service_type == '1') {
				obj.in01 = x.in_morning;
				obj.out01 = x.out_morning;
			}

			if (x.service_type == '2') {
				obj.in02 = x.in_afternoon;
				obj.out02 = x.out_afternoon || x.out_afternoon2;
			}

			if (x.service_type == '3') {
				obj.in03 = x.in_evening || x.in_evening2;
				obj.out03 = x.out_evening;
			}

			results.push(obj);
		}
	});
});

console.log(results);