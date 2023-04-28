const { response } = require('express')
const Garden_piece = require('../models/garden_piece.model')

exports.getGardenPName = async (id) => {
    const name = await Garden_piece.find({'id' : id})
        .then(piece =>  {
            return piece[0].name
        })
        .catch(err => console.log(err))

    return name
}

exports.getGPieceList = (req, res) => {
    Garden_piece.find({})
        .then(piece => res.status(200).send(piece))
        .catch(err => res.status(400).send(err))
}

exports.getPrivateGPiece = (req, res) => {
    const query = { owner: req.params['owner'] }
    Garden_piece.find(query)
        .then(piece => res.status(200).send(piece))
        .catch(err => res.status(400).send(err))
}

exports.getGPieceById = (req, res) => {
    const query = { id: req.params['id'] }
    Garden_piece.find(query)
        .then(piece => res.status(200).send(piece))
        .catch(err => res.status(400).send(err))
}

exports.delGPiece = (req, res) => {
    Garden_piece.findOneAndDelete({ id: req.params['id'] })
        .then(data => console.log(data))
        .catch(err => res.status(400).send(err))
}

exports.handleRequest = (req, res) => {
    const data = req.body
    const request = data.request
    if (request == "add") {
        Garden_piece.findOne({})
            .sort({ id: 'desc' })
            .then(latest => {
                data.id = latest.id + 1;

                Garden_piece.insertMany([
                    {
                        id: data.id,
                        name: data.name,
                        type: data.type,
                        location: data.location,
                        owner: data.owner,
                        area: data.area,
                        days: 20
                    }
                ])
            }).then(item => res.status(200).send(item))
            .catch(err => res.status(400).send(err))
    } else {
        const id = data.id
        Garden_piece.collection.updateOne(
            { "id": parseInt(id) },
            {
                $set: {
                    name: data.name,
                    type: data.type,
                    location: data.location,
                    owner: data.owner,
                    area: data.area,
                }
            }
        ).then(item => res.status(200).send(item))
        .catch(err => res.status(400).send(err))
    }
    // res.status(200).send('OK')
}