const fs = require('fs-extra');

const attributes = require('./functions/attributes');
const auth = require('./functions/auth');

module.exports = async function (context, req) {

    const username = (req.query.username);
    const password = (req.query.password);
    const purl = (req.query.purl);
    const tag_number = (req.query.tag_number);
    const live_view_name = (req.query.live_view_name);
    const register_view_name = (req.query.register_view_name);

    const function_name = (req.query.function_name || "attributes");

    let result = "";

    const sample = () => {
        return new Promise((resolve, reject) => {
            // var data = fs.readFileSync('D:/local/Temp/settings.json');
            resolve(fs.readFileSync('D:/local/Temp/settings.json'))
        })
    }

    switch (function_name) {
        case "auth":
            result = await auth.add(username, password, purl)
            break;
        case "attributes":
            result = await attributes.get(tag_number)
            break;
        case "getAuth":
            result = await sample()
            break;

        default:
            break;
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            'Content-Type': 'text/csv',
            "Content-Disposition": `attachment; filename=${tag_number + "-attributes-" + new Date().getTime() + ".csv"}`
        },
        body: result
    };
}