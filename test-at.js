var data = [
  {
    checkin_date: '2016-09-30',
    checkin: ['23:51:55']
  },
  {
    checkin_date: '2016-10-03',
    checkin: ['08:07:04', '16:49:38', '23:58:26']
  },
  {
    checkin_date: '2016-10-04',
    checkin: ['08:29:16']
  },
  {
    checkin_date: '2016-10-05',
    checkin: ['16:07:03']
  },
  {
    checkin_date: '2016-10-06',
    checkin: ['00:08:29', '08:08:13', '16:18:21']
  },
  {
    checkin_date: '2016-10-07',
    checkin: ['00:00:35', '08:22:09']
  },
  {
    checkin_date: '2016-10-08',
    checkin: ['00:00:22', '08:42:27']
  },
  {
    checkin_date: '2016-10-09',
    checkin: ['08:10:18']
  }
];

let moment = require('moment')

// หาเวรเช้า  07:00 - 09:00


let timeServices = [];

data.forEach(v => {
  let startMorningTime = moment('07:00:00', 'HH:mm:ss');
  let endMorningTime = moment('10:00:00', 'HH:mm:ss');

  let startAfternoonTime = moment('15:00:00', 'HH:mm:ss');
  let endAfternoonTime = moment('17:00:00', 'HH:mm:ss');
  let startEveningTime = moment('23:00:00', 'HH:mm:ss');
  let endEveningTime = moment('23:59:00', 'HH:mm:ss');
  let isMorning = moment(v.checkin[0], 'HH:mm:ss').isBetween(startMorningTime, endMorningTime);

  if (isMorning) {
    let obj = {};
    obj.all_checkin = JSON.stringify(v);
    obj.checkin_date = v.checkin_date;

    if (v.checkin[1] && !v.checkin[2]) {
      obj.start = v.checkin[0];
      obj.end = v.checkin[1];
    } else {
      // 08:07:04,16:49:38,23:58:26
      let isEvening = moment(v.checkin[2], 'HH:mm:ss').isBetween(startEveningTime, endEveningTime)
      if (isEvening) {
        obj.start = v.checkin[1];
        obj.end = v.checkin[2]
      } else {
        obj.start = v.checkin[0]
        obj.end = v.checkin[2];
      }
    }

    timeServices.push(obj);
    
  } else {
    let aa = v.checkin[0].split(':')
    let isMorning = moment(v.checkin[1], 'HH:mm:ss').isBetween(startMorningTime, endMorningTime)
    if (aa == '00' && isMorning) { // 00-00-00, 08:30:00
      if (v.checkin[2]) { // 00:00:00, 08:30:00, 16:00:00
        let isEvening = moment(v.checkin[2], 'HH:mm:ss').isBetween(startEveningTime, endEveningTime)
        if (isEvening) {
          let obj = {};
          // สงสัยเวรเช้า
          // check เวลาออก
          if (v.checkin[3]) {
            let xx = moment(v.checkin[3], 'HH:mm:ss').isBefore(endEveningTime)
            if (xx) {
              // เวรบ่าย
            } else {
              // เวรเช้า
              obj.start = v.checkin[1]
              obj.end = v.checkin[2]
            }
          } else {
            // เวรเช้า
            obj.start = v.checkin[1];
            obj.end = v.checkin[2];
          }

          timeServices.push(obj);
        } else {
          // ไม่ใช่เวรเช้า
        }
      
      } else {
        // ไม่ใชเวรเช้า
      }
    } else {
      // ไม่ใช่เวรเช้า
    }
  }
}) // end for

console.log(timeServices)
