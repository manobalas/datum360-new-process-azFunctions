const fs = require('fs-extra');

const auth = require('./functions/auth');
const attributes = require('./functions/attributes');
const liveview = require('./functions/liveview');
const liveview_tag_number = require('./functions/liveview_tag_number');
const post_attributes = require('./functions/post_attributes');
const registerview = require('./functions/registerview');
const importfun = require('./functions/importfun');

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
            result = await liveview.get(live_view_name)
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

        default:
            break;
    }

    let normalHeader = {
        'Content-Type': 'text/csv',
        "Content-Disposition": `attachment; filename=${function_name + new Date().getTime() + ".csv"}`
    }

    let jsonHeader = {
        'Content-Type': 'application/json',
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: function_name == "import" || function_name == "liveview" || function_name == "post_attributes_json" || function_name == "liveview_tag_number" ? jsonHeader : normalHeader,
        body: result
    };
}
