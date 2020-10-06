module.exports = async function (context, req) {
    context.res = {
        // status: 200, /* Defaults to 200 */
        // headers: {
        //     'Content-Type': 'text/csv',
        //     "Content-Disposition": `attachment; filename=${tag_number + "-attributes-" + new Date().getTime() + ".csv"}`
        // },
        body: "Hi Auth"
    };
}