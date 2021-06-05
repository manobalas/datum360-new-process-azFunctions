// const fs = require('fs-extra');
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;
const json2xlsx = require('node-json-xlsx');
var json2xls = require('json2xls');
const pimApis = require("../api/api-pim360");
const fs = require('fs');

const allUsers = [{
        "firstName": "Shubham",
        "lastName": "Verma",
        "email": "example@gmail.com",
        "Mob:": 1234567890,
        "country": "India"
    }];

const path = require('path');

// const directory = 'D:/local/Temp/uploads';

// fs.readdir(directory, (err, files) => {
//   if (err) throw err;

//   for (const file of files) {
//     fs.unlink(path.join(directory, file), err => {
//       if (err) throw err;
//     });
//   }
// });


const upload = function (file, some) {
    
    return new Promise((resolve, reject) => {
        try {
            var dir = 'D:/local/Temp/uploads';
try {
  fs.mkdirSync(dir);
} catch(e) {
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
            // authPim().then( () => {
                
                // // upload code starts... 
                // fs.readdir('D:/local/Temp/uploads/', (err, files) => {
                //     if (err) {
                //         // console.log("Unable to find files......");
                //         resolve({ "writeFileSync": "Unable to find files......" })
                //         // console.log(err)
                //         // return process.exit()
                //     }
                //     else {
                //         if (files.length == 0) {
                //             // console.log("could not found any file to process!!!")
                //             // return process.exit()
                //             resolve({ "writeFileSync": "could not found any file to process!!!" })
                //         }
                //         else if (files.length == 1) {
                //             // console.log(files[0])
                //             // console.log("Uploading files......")
                //             // resolve(true);
                //             return files[0];
                //         }
                //         else {
                //             // console.log("Unable to process too many files...!!!")
                //             resolve({ "writeFileSync": "Unable to process too many files...!!!" })
                //             // return process.exit();
                //         }
                //     }
                // }).then((filename)=>{

                //     return pim.uploadFile('D:/local/Temp/uploads/'+filename)
                //         // return uploadFiles(filename)
                //     }).then(({hdl}) => {
                //         resolve({ "writeFileSync": hdl })

                //     })
                // // upload code ends... 
            // })
        } catch (err) {
            resolve({ "response": JSON.stringify(err) })
        }
    });
}

const download_new = function (file, some) {   
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
                .then((response) => {                        
                    resolve({"response": JSON.stringify(response)});
                }).catch((err) => {
                    resolve({"response": err})
                })
            });            
        });
    } catch (err) {
        resolve({ "response": err })
    }
}

const download = function (file, some) {
    return new Promise((resolve, reject) => {
        try {
            resolve(fs.readFileSync('D:/local/Temp/uploads/sample.xlsx'))
        } catch (err) {
            resolve({ "response": err })
        }
    });
}

exports.upload = upload;
exports.download_new = download_new;
exports.download = download;

// resolve(fs.  ('D:/local/Temp/sample.xlsx'))