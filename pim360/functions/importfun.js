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
            // var json = {
            //     foo: 'bar',
            //     qux: 'moo',
            //     poo: 123,
            //     stux: new Date()
            // }
            // var xlsx = json2xlsx(json);
            // fs.writeFileSync('D:/local/Temp/data.json', xlsx);
            const filename = 'sample.xlsx';
            var xls = json2xls(allUsers);
            fs.writeFileSync(filename, xls, 'binary', (err) => {
                if (err) {
                    // console.log("writeFileSync :", err);
                    resolve({ "writeFileSync": err })
                }
                resolve({ "writeFileSync": "file is saved" })
            });
            resolve({ "writeFileSync": "file is saved" })
            // resolve({ "response": "test!" })
        } catch (err) {
            resolve({ "response": JSON.stringify(err) })
        }
    });
}

const download = function (file, some) {
    return new Promise((resolve, reject) => {
        try {
            resolve(fs.readFileSync('D:/local/Temp/data.json'))
        } catch (err) {
            resolve({ "response": err })
        }
    });
}

// fs.readFileSync('D:/local/Temp/settings.json')

exports.upload = upload;
exports.download = download;