// const fs = require('fs-extra');
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;
const json2xlsx = require('node-json-xlsx');
var json2xls = require('json2xls');
const pimApis = require("../api/api-pim360");
const fs = require('fs');

const allUsers = [];

const upload = function (file, some) {
    let pim = null;    
    function authPim() {        
        pim = new pimApis(JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')));
        return pim.getToken('pim');
    }
    return new Promise((resolve, reject) => {
        try {
            authPim().then( () => {
                const filename = 'D:/local/Temp/sample.xlsx';
                var xls = json2xls(allUsers);
                fs.writeFileSync(filename, xls, 'binary', (err) => {
                    if (err) {
                        resolve({ "writeFileSync": err })
                    }
                    resolve({ "writeFileSync": "file is saved" })
                });
                // resolve({ "writeFileSync": "file is saved" })
                // upload code starts... 
                fs.readdir('D:/local/Temp/', (err, files) => {
                    if (err) {
                        // console.log("Unable to find files......");
                        resolve({ "writeFileSync": "Unable to find files......" })
                        // console.log(err)
                        // return process.exit()
                    }
                    else {
                        if (files.length == 0) {
                            // console.log("could not found any file to process!!!")
                            // return process.exit()
                            resolve({ "writeFileSync": "could not found any file to process!!!" })
                        }
                        else if (files.length == 1) {
                            // console.log(files[0])
                            // console.log("Uploading files......")
                            // resolve(true);
                            resolve(files[0]);
                        }
                        else {
                            // console.log("Unable to process too many files...!!!")
                            resolve({ "writeFileSync": "Unable to process too many files...!!!" })
                            // return process.exit();
                        }
                    }
                }).then((filename)=>{

                    return pim.uploadFile('D:/local/Temp/'+filename)
                        // return uploadFiles(filename)
                    }).then(({hdl}) => {
                        resolve({ "writeFileSync": hdl })

                    })
                // upload code ends... 
            })
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