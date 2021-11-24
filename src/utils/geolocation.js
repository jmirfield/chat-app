const request = require('request')

const getLocation = (lat, long, cb) => {
    request({
        url: `http://api.positionstack.com/v1/reverse?access_key=${process.env.GEO_KEY}&query=${lat},${long}&limit=1`,
        json: true
    }, (error, response) => {
        if(error || response.body.error)return cb("Error with API", undefined)
        if(response.body.data[0].locality === undefined || response.body.data[0].region === undefined)return cb("Could not find location", undefined)
        cb(undefined, {city: response.body.data[0].locality, state: response.body.data[0].region})
    })
}

module.exports = { getLocation }