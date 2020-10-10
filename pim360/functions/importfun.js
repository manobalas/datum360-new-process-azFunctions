const upload = function (file, some) {
    return new Promise((resolve, reject) => {
        resolve({file, some})
    })
}


exports.upload = upload;