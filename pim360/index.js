const settings = require("./settings.json");
const pimApis = require("./api/api-pim360");
const reqprom = require('request-promise');
const json2csv = require("json2csv").parse;

module.exports = async function (context, req) {

    const tag_number = (req.query.tag_number || (req.body && req.body.tag_number));

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

    let result = ""
    let promise = new Promise((resolve, reject) => {
        authPim().then((authResponse) => {
            console.log("Authenticated!")
            fetchAttributes(tag_number, authResponse.access_token)
                .then((reposonse) => {
                    console.log("Fetched Attributes!")
                    try {
                        let arrkeys = Object.keys(reposonse.attrs);
                        let obj = {};
                        let arrModifiedData = [];
                        arrkeys.map((key) => {
                            obj[reposonse.attrs[key].name] = reposonse.attrs[key].value;
                            return '';
                        });
                        let fields = Object.keys(obj);
                        const csv = json2csv(obj, fields);
                        resolve(csv)
                    } catch (error) {
                        resolve("Something Went Wrong")
                    }
                }).catch(() => {
                    resolve("Not Found / Something Went Wrong")
                })
        });

    });

    result = await promise;
    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            'Content-Type': 'text/csv',
            "Content-Disposition": `attachment; filename=${tag_number + "-attributes-" + new Date().getTime() + ".csv"}`
        },
        body: result
    };
}