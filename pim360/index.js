const fs = require('fs-extra');

const auth = require('./functions/auth');
const attributes = require('./functions/attributes');
const liveview = require('./functions/liveview');
const liveview_tag_number = require('./functions/liveview_tag_number');
const liveviewcsv = require('./functions/liveview_csv');
const post_attributes = require('./functions/post_attributes');
const registerview = require('./functions/registerview');
const importfun = require('./functions/importfun');

// const csvChecker = function processData(allText) {
//     var allTextLines = allText.split(/\r\n|\n/);
//     var headers = allTextLines[0].split(',');
//     var lines = [];

//     for (var i=1; i<allTextLines.length; i++) {
//         var data = allTextLines[i].split(',');
//         if (data.length == headers.length) {

//             var tarr = [];
//             for (var j=0; j<headers.length; j++) {
//                 tarr.push(headers[j]+":"+data[j]);
//             }
//             lines.push(tarr);
//         }
//     }
//     return lines.length
// }

module.exports = async function (context, req) {

    const username = (req.query.username);
    const password = (req.query.password);
    const purl = (req.query.purl);
    const tag_number = (req.query.tag_number || (req.body && req.body.tag_number));
    const live_view_name = (req.query.live_view_name);
    const objectType = (req.query.objectType);
    // some
    const EIC = (req.query.EIC) == undefined ? '' : (req.query.EIC);
    const register_view_name = (req.query.register_view_name);

    // example
    const filebody = (req.body && req.body.file);
    const some = (req.body && req.body.some);

    const function_name = (req.query.function_name || "attributes");

    let result = "";

    switch (function_name) {
        case "auth":
            result = await auth.add(username, password, purl)
            break;
        case "attributes":
            result = await attributes.get(tag_number)
            break;
        case "post_attributes":
            result = await post_attributes.get(encodeURIComponent(tag_number), "csv")
            break;
        case "post_attributes_json":
            result = await post_attributes.get(encodeURIComponent(tag_number), "json")
            break;
        case "liveview":
            result = await liveview.get(live_view_name, "")
            break;
        case "liveview_to_geojson":
            result = await liveview.get(live_view_name, "geojson")
            break;
        case "liveview_csv":
            result = await liveviewcsv.get(live_view_name)
            break;
        case "liveview_tag_number":
            result = await liveview_tag_number.get(live_view_name)
            break;
        case "registerview":
            result = await registerview.get(register_view_name, objectType, EIC)
            break;
        case "import":
            result = await importfun.upload(filebody, req)
            break;
        case "download":
            result = await importfun.download(filebody, req)
            break;

        default:
            break;
    }

    let normalHeader = {
        'Content-Type': function_name == 'liveview_to_geojson' ? 'application/json' : (function_name == 'download' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv'),
        "Content-Disposition": `attachment; filename=${function_name + new Date().getTime() + (function_name == 'liveview_to_geojson' ? '.geojson' : (function_name == 'download' ? '.xlsx' : ".csv"))}`,
        "is-cord-avail": function_name == 'liveview_to_geojson' ? result.isCordPresent : "false"
    }

    let jsonHeader = {
        'Content-Type': 'application/json',
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: function_name == "auth" || function_name == "import" || function_name == "liveview" || function_name == "post_attributes_json" || function_name == "liveview_tag_number" ? jsonHeader : normalHeader,
        body: function_name == 'liveview_to_geojson' ? result.baseobj : result
    };
}
