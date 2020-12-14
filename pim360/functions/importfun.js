// const fs = require('fs-extra');
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;
const json2xlsx = require('node-json-xlsx');
var json2xls = require('json2xls');
const fs = require('fs');

const allUsers = [
    {
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    },
    {
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    },
    {
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    },
    {
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    },
    {
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    },
    {
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    },
    {
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    }
];

const upload = function (file, some) {
    return new Promise((resolve, reject) => {
        try {
            const filename = 'D:/local/Temp/sample.xlsx';
            var xls = json2xls(allUsers);
            fs.writeFileSync(filename, xls, 'binary', (err) => {
                if (err) {
                    resolve({ "writeFileSync": err })
                }
                resolve({ "writeFileSync": "file is saved" })
            });
            resolve({ "writeFileSync": "file is saved" })
        } catch (err) {
            resolve({ "response": JSON.stringify(err) })
        }
    });
}

const download = function (file, some) {
    return new Promise((resolve, reject) => {
        try {
            resolve(fs.readFileSync('D:/local/Temp/sample.xlsx'))
        } catch (err) {
            resolve({ "response": err })
        }
    });
}

exports.upload = upload;
exports.download = download;