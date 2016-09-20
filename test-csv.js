'use strict';

var csvParse = require('csv-parse');
var fs = require('fs');
var stripBom = require('strip-bom');
var Papa = require('babyparse')

var dataFile = fs.readFileSync('./sample_data/data3.csv', 'utf8');
var result = Papa.parse(dataFile, {delimiter: '\t'});
console.log(result.data);

// console.log(dataFile.replace(/^\uFEFF/, ''));

// fs.readFile('./sample_data/data3.csv', (err, data) => {
//     if (err) console.log(err);
//     else {

//         // csvParse(data, {
//         //     delimiter: '\t',
//         //     columns: true
//         // }, (err, items) => {
//         //     if (err) {
//         //         console.log(err)
//         //     } else {
//         //         console.log(items);
//         //     }
//         // })
//         // console.log(data);
//         // console.log('---------')
//         // console.log(stripBom(data));

//         let _data = data.toString().split("\n");


//         // console.log(_data);
//         let header = stripBom(_data[0]).split('\t');
//         console.log(header);
//         /* No, DN, UID, NAME, Status, Action, APB, JobCode, DateTime */
//         let items = [];
//         _data.forEach((v, i) => {
            
//             if (i > 0) {
//                 let arrItem = v.toString().split("\t");
//                 let objItem = {
//                     No: arrItem[0],
//                     DN: arrItem[1],
//                     UID: arrItem[2],
//                     NAME: arrItem[3],
//                     Status: arrItem[4],
//                     Action: arrItem[5],
//                     APB: arrItem[6],
//                     JobCode: arrItem[7],
//                     DateTime: arrItem[8],
//                 };
//                 items.push(objItem);
//             }
//         });

//         // console.log(items);

//     }
// });
