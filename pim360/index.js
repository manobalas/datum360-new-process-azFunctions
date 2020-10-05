const settings = require("./settings.json");
const pimApis = require("./api/api-pim360");
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;
const fs = require('fs-extra');

module.exports = async function (context, req) {

    function authPim() {
        console.log("Authenticating ......")
        let pim = new pimApis(settings);
        return pim.getToken('pim');
    }

    function fetchAttributes(tagnumber, token) {
        console.log("Fetching Attributes ......");
        let url = settings.paths.pim + "api/objects/TAGGED_ITEM/id/" + tagnumber;
        let options = {
            url: url,
            headers: { Authorization: 'Bearer ' + token },
            json: true
        };
        return reqprom.get(options)
    }

    // var dir = './generated';
    // if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    // }

    let result = ""
    let final = ""
    let promise = new Promise((resolve, reject) => {
        authPim().then((authResponse) => {
            console.log("Authenticated!")
            fetchAttributes(tagnumber = "Arsenal", authResponse.access_token)
                .then((reposonse) => {
                    console.log("Fetched Attributes!")
                    let arrkeys = Object.keys(reposonse.attrs);
                    let obj = {};
                    let arrModifiedData = [];
                    arrkeys.map((key) => {
                        obj[reposonse.attrs[key].name] = reposonse.attrs[key].value;
                        return '';
                    });
                    let fields = Object.keys(obj);
                    const csv = json2csv(obj, fields);
                    let fileName = "./generated/" + tagnumber + "-attributes-" + new Date().getTime() + ".csv";
                    try {
                        // fs.writeFileSync(fileName, csv);
                        resolve(csv)
                    } catch (error) {
                        resolve(err.message)
                    }
                })
        });

    });

    result = await promise;
    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            'Content-Type': 'text/csv',
            "Content-Disposition": `attachment; filename=attributes.csv`
        },
        body: result
    };
}