const fs = require('fs-extra');

const auth = require('./functions/auth');
const attributes = require('./functions/attributes');
const liveview = require('./functions/liveview');
const registerview = require('./functions/registerview');
const importfun = require('./functions/import');

module.exports = async function (context, req) {

    const username = (req.query.username);
    const password = (req.query.password);
    const purl = (req.query.purl);
    const tag_number = (req.query.tag_number);
    const live_view_name = (req.query.live_view_name);
    const objectType = (req.query.objectType);
    // some
    const EIC = (req.query.EIC) == undefined ? '' : (req.query.EIC);
    const register_view_name = (req.query.register_view_name);

    const filebody = (req.body.file);
    const some = (req.body.some);

    const function_name = (req.query.function_name || "attributes");

    let result = "";

    switch (function_name) {
        case "auth":
            result = await auth.add(username, password, purl)
            break;
        case "attributes":
            result = await attributes.get(tag_number)
            break;
        case "liveview":
            result = await liveview.get(live_view_name, objectType, EIC)
            break;
        case "registerview":
            result = await registerview.get(register_view_name, objectType, EIC)
            break;
        case "import":
            result = await import.upload(filebody, some)
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
        headers: function_name == "import" ? jsonHeader : normalHeader,
        body: result
    };
}
