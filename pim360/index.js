const attributes = require('./functions/attributes');

module.exports = async function (context, req) {   

    const tag_number = (req.query.tag_number);
    const live_view_name = (req.query.live_view_name);
    const register_view_name = (req.query.register_view_name);

    const function_name = (req.query.function_name || "attributes");
    
    let result = "";

    switch (function_name) {
        case "attributes":
            result = await attributes.get(tag_number)
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