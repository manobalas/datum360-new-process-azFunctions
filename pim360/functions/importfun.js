// const fs = require('fs-extra');
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;
const json2xlsx = require('node-json-xlsx');
var json2xls = require('json2xls');
const pimApis = require("../api/api-pim360");
const fs = require('fs');

const allUsers = [{
    "TAG NUMBER": "01-CV-1001",
    "ASSET": "TKF",
    "CLASS NAME": "CONTROL VALVE",
    "DESCRIPTION": "something new from api"
}];

const path = require('path');

const upload = function(file, some) {
    return new Promise((resolve, reject) => {
        try {
            var dir = 'D:/local/Temp/uploads';
            try {
                fs.mkdirSync(dir);
            } catch (e) {
                // if (e.code != 'EEXIST') throw e;
            }
            const filename = 'D:/local/Temp/uploads/sample.xlsx';
            var xls = json2xls(file.xlsxData);
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

const download_new = function(file, some) {
    try {
        function authPim() {
            let pim = new pimApis(JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')));
            return pim.getToken('pim');
        }

        function uploadFile(path, token) {
            let url = JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')).paths.pim + "api/file";
            let options = {
                url: url,
                headers: { Authorization: 'Bearer ' + token },
                formData: {
                    front: fs.createReadStream(path)
                },
                json: true
            }
            return reqprom.post(options);
        }
        return new Promise((resolve, reject) => {
            authPim().then((authResponse) => {
                uploadFile('D:/local/Temp/uploads/sample.xlsx', authResponse.access_token)
                    .then(({ Hdl }) => {
                        resolve({ "response": Hdl });
                    }).catch((err) => {
                        resolve({ "response": err })
                    })
            });
        });
    } catch (err) {
        resolve({ "response": err })
    }
}

const download = function(file, some) {
    return new Promise((resolve, reject) => {
        try {
            resolve(fs.readFileSync('D:/local/Temp/uploads/sample.xlsx'))
        } catch (err) {
            resolve({ "response": err })
        }
    });
}

const updateFinal = function(file, fileHDL) {
    try {

        function authPim() {
            let pim = new pimApis(JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')));
            return pim.getToken('pim');
        }

        function updateFinalObj(access_token) {
            let dataparams = file.finalObj;
            dataparams.params.inputfile = fileHDL;
            let url = JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')).paths.pim + `api/etl_queue/activities/${dataparams.hdl}`;
            let options = {
                url: url,
                body: dataparams,
                headers: { Authorization: 'Bearer ' + access_token },
                json: true,
                resolveWithFullResponse: true
            };
            return reqprom.post(options);
        }
        // code goes here
        return new Promise((resolve, reject) => {
            // resolve({ "response": ""+fileHDL+"" })

            authPim().then((authResponse) => {
                updateFinalObj(authResponse.access_token)
                    .then((response) => {
                        resolve({ "response": response });
                    }).catch((err) => {
                        resolve({ "response": err })
                    })
            });
        });
    } catch (err) {
        resolve({ "response": err })
    }
}

exports.upload = upload;
exports.download_new = download_new;
exports.download = download;
exports.update = updateFinal;

// resolve(fs.  ('D:/local/Temp/sample.xlsx'))
