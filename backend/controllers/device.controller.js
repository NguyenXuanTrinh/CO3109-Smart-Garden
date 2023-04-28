const Device = require('../models/device.model')
const Record = require('../models/record.model')

exports.getThresholdById = async (id) => {
    const threshold = Device.find({'id' : id})
        .then((res) => {
            return {min: res[0].threshold.min, max: res[0].threshold.max}
        })
        .catch(err => console.log(err))
    return threshold
}

exports.getDevices = (req, res) => {
    Device.find({})
        .then(user => res.status(200).send(user))
        .catch(err => res.status(400).send(err))
}

exports.getDevicesByID = async (id) => {
    const device = await Device.find({'id' : id})
        .then(res => res[0])
        .catch(err => console.log(err))

    return device
}


exports.postThreshold = (req,res) => {
    // console.log(req.body)
    var a = 0;
    const data = req.body
    // console.log(data)
    Device.updateOne({type:"temp", owner:data.owner},
    {
        $set: {
            threshold : {
                min: data.minTemp,
                max: data.maxTemp
            }
        },
    })
    .then(console.log("thanh cong"))
    .catch((err) => console.log(err))

    Device.updateOne({type:"soil",owner:data.owner},
    {
        $set: {
            threshold : {
                min: data.soil,
                max: data.maxSoil
            }
        },
    })
    .then(res.status(200).send("OK"))
    .catch((err) => console.log(err))
}

exports.getThreshold = (req,res) => {
    var thresholds = {}
    Device.find({})
    .then((devices) => {
        devices.forEach((device) => {
            if(device.type === "temp"){
                thresholds.minTemp = device.threshold.min;
                thresholds.maxTemp = device.threshold.max
                // threshold = {
                //     ...threshold,
                //     minTemp:device.threshold.min,
                //     maxTemp:device.threshold.max
                // }
            }
            if(device.type === "soil"){
                thresholds.soil = device.threshold.min;
                thresholds.maxSoil = device.threshold.max
                // threshold = {
                //     ...threshold,
                //     soil:device.threshold.min,
                //     maxSoil:device.threshold.max
                // }
            res.send(thresholds)
            }
        })
    })
    .catch((err) => console.log(err))

}

exports.handleDeviceRequest = (req, res) => {
    let data = req.body
    const request = data.request 
    if (request == "add") {
        Device.findOne({})
            .sort({ id: 'desc' })
            .then(latest => {
                data.id = latest.id + 1;

                Device.insertMany([
                    {
                        id: data.id,
                        name: data.name,
                        type: data.type,
                        owner: data.owner,
                        coordinates: data.coordinates,
                        status: true,
                        threshold: data.threshold,
                        water: data.water,
                        time: data.time,
                        garPiece: data.garPiece
                    }
                ])
                Record.insertMany([
                    {
                        id: data.id,
                        name: data.name,
                        type: data.type, 
                        owner: data.owner,
                        valueList: [],
                        curValue: null, 
                        garPiece: data.garPiece
                    }
                ])
            })
            .then(item => res.status(200).send(item))
            .catch(err => res.status(400).send(err))
    } else if (request == "update") {
        const id = data.id
        Device.collection.updateOne(
            { "id": parseInt(id) },
            {
                $set: {
                    garPiece: data.garPiece,
                    coordinates: data.coordinates,
                    threshold: data.threshold,
                    water: data.water,
                    time: data.time,
                }
            }
        ).then(item => res.status(200).send(item))
        .catch(err => res.status(400).send(err))
    } else {
        const id = data.id
        Device.collection.updateOne(
            { "id": parseInt(id) },
            {
                $set: {
                    status: data.status
                }
            }
        ).then(item => res.status(200).send(item))
            .catch(err => res.status(400).send(err))
    }
    // res.status(200).send("handle device request OK")
}