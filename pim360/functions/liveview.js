const fs = require('fs-extra');
const pimApis = require("../api/api-pim360");
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;


const get = function (live_view_name, op_type) {

    let pim = null;
    let eic_hdl = "";
    function authPim() {
        console.log("Authenticating ......")
        pim = new pimApis(JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')));
        return pim.getToken('pim');
    }

    let arrData = [];
    function getFinalResult(queryResult, pageSize = 200, page = 0) {
        return pim._runQuery(queryResult, pageSize, page)
            .then((result) => {
                // Return when we have a status
                arrData.push(...result.data);
                console.log("Fetched " + arrData.length + " ......")
                if (result.hasmore) {
                    return getFinalResult(queryResult, pageSize, (arrData.length / pageSize) * 200)
                } else {
                    return Promise.resolve(arrData);
                }
            })
    }

    function isNaNCheckReturn(value) {
        if(isNaN(parseFloat(value))) {
            return 0
        } else {
            return parseFloat(value)
        }
    }

    return new Promise((resolve, reject) => {
        try {
            let nameToFilter = live_view_name;
            // authPim().then((authResponse) => {
            //     console.log("Authenticated!")
            //     return pim.getCustomViews("LIVE_VIEW", "");
            // })
            authPim().then((authResponse) => {
                return pim.getCustomViews("LIVE_VIEW", "");
            }).then((arrLiveView) => {
                console.log("Working on it ......")
                let filterdData = arrLiveView.filter((e) => e.Name == nameToFilter);
                if (filterdData.length > 0) {
                    return pim.getCustomViews("", filterdData[0].Hdl)
                }
                else {
                    console.log("Could not found any data......");
                    console.log("Process finished !!!");
                    return process.exit();
                }
            }).then((result) => {
                console.log("Fetching Live View ......")
                let createQueryBody = {
                    "type": result.Model,
                    "eic": result.Data.eicHdl,
                    "filter": result.Data.conditions,
                    "fields": result.Data.fields
                }
                //                 resolve(createQueryBody)
                return pim.postRequest(JSON.parse(fs.readFileSync('D:/local/Temp/settings.json')).paths.pim + "api/queries", createQueryBody, 'pim')
            }).then((response) => {
                console.log("Fetching ......")
                return getFinalResult(response, 200, 0);
            }).then((finalResult) => {
                console.log("Finalizing ......")
                let arrFirstObjKeys = Object.keys(finalResult[0]).filter(e => typeof finalResult[0][e] == 'object')
                let arrModifiedData = [];
                finalResult.map((item) => {
                    let obj = {};
                    arrFirstObjKeys.map((key) => {
                        obj[item[key].name] = item[key].value;
                    });
                    arrModifiedData.push(obj);
                });
                let fields = Object.keys(arrModifiedData[0]);
                const csv = json2csv(arrModifiedData, fields);

                // "crs": {
                    //     "type": "name",
                    //     "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
                    // },

                let baseobj = {
                    "type": "FeatureCollection",
                    
                    "features": []
                }
                //
                arrModifiedData.map(i => {
                    let lat = i.hasOwnProperty("LATITUDE") ? isNaNCheckReturn(i.LATITUDE) : (i.hasOwnProperty("Latitude") ? isNaNCheckReturn(i.Latitude) : (i.hasOwnProperty("Approved Latitude") ? isNaNCheckReturn(i['Approved Latitude']) : 0))
                    let lng = i.hasOwnProperty("LONGITUDE") ? isNaNCheckReturn(i.LONGITUDE) : (i.hasOwnProperty("Longitude") ? isNaNCheckReturn(i.Longitude) : (i.hasOwnProperty("Approved Longitude") ? isNaNCheckReturn(i['Approved Longitude']) : 0))
                    let tempobjj = {
                        "type": "Feature",
                        "properties": { ...i },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [lat, lng]
                        }
                    }
                    baseobj.features.push(tempobjj)
                })

                let isCordPresent = baseobj.features[0].geometry.coordinates[0] === 0  ? "false" : "true";
                // if(baseobj.features.length > 0) {
                //     let ttobj = Object.keys(baseobj.features[0])
                //     ttobj.map(i => {
                //         if(i.toLowerCase().includes("latitude")) {
                //             isCordPresent = true
                //         }
                //     })
                // }                


                // op_type
                let finalll = null;
                if (op_type == "geojson") {
                    finalll = {
                        "isCordPresent": isCordPresent,
                        "baseobj": baseobj
                    };
                } else {
                    finalll = arrModifiedData
                }
                resolve(finalll)
            }).catch(err => {
                resolve(err)
            })
        } catch (error) {
            resolve(error)
        }
    })
}


exports.get = get;
