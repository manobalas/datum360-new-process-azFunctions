const getFormData = require('get-form-data');

const upload = function (file, some) {
    return new Promise((resolve, reject) => {
        let data = getFormData(some.rawBody)
        resolve({file, data})
    })
}


exports.upload = upload;