const fs = require('fs-extra');
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;
const json2xlsx = require('node-json-xlsx');

const upload = function (file, some) {
    return new Promise((resolve, reject) => {
        try {
            var json = {
                foo: 'bar',
                qux: 'moo',
                poo: 123,
                stux: new Date()
            }
            var xlsx = json2xlsx(json);
            fs.writeFileSync('D:/local/Temp/data.xlsx', xlsx, 'binary');
            resolve({ "response": "test!" })
        } catch (err) {
            resolve({ "response": JSON.stringify(err) })
        }
    });
}

const download = function (file, some) {
    return new Promise((resolve, reject) => {
        try {
            resolve(fs.readFileSync('D:/local/Temp/data.xlsx'))
        } catch (err) {
            resolve({ "response": err })
        }
    });
}

// fs.readFileSync('D:/local/Temp/settings.json')

exports.upload = upload;
exports.download = download;