// const fs = require('fs-extra');
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;
const json2xlsx = require('node-json-xlsx');
var json2xls = require('json2xls');
const pimApis = require("../api/api-pim360");
const fs = require('fs');

const allUsers = [{
    "TAG NUMBER": "MCC-01-LG-10021",
    "ASSET": "MCCs",
    "CLASS NAME": "GAUGEs",
    "MANUFACTURER": "ABBs"
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

const updateFinal = function(fileHDL) {
    try {

        let dataparams = {
            "hdl": "rUEu8OeLQim0FYzX79DAHA",
            "status": "PENDING",
            "params": {
                "eic_handle": "4rJOtL9ESTu83fGyz7hAGA",
                "manifest_name": "",
                "inputfile": fileHDL,
                "worksheets": "",
                "object_type": "TAGGED_ITEM",
                "deliverable": "",
                "source_handle": "",
                "classification": "cls",
                "ens_name": "",
                "terminate_attributes": "ignore"
            }
        };
        // dataparams.params.inputfile = fileHDL;

        function updateFinalObj(access_token) {
            let url = JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')).paths.pim + `api/etl_queue/activities/${dataparams.hdl}`;
            let options = {
                url: urls,
                body: dataparams,
                headers: { Authorization: 'Bearer ' + access_token },
                json: true,
                resolveWithFullResponse: true
            };
            return reqprom.post(options);
        }
        // code goes here
        // return updateFinalObj(timeline)
        return new Promise((resolve, reject) => {
            // resolve({ "response": "hey" })

            authPim().then((authResponse) => {
                updateFinalObj(authResponse.access_token)
                    .then((response) => {
                        resolve({ "response": response });
                    }).catch((err) => {
                        resolve({ "response": err })
                    })
            });

            // authPim().then((authResponse) => {
            //     updateFinalObj(authResponse).then((rr) => {
            //         resolve({ "response": rr });
            //     }).catch((err) => {
            //         resolve({ "response": err })
            //     })
            // });
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