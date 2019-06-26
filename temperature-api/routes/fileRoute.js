const express = require('express');
const temperatureModel = require('../database/schema');
const router = express.Router();
const fs = require("fs");
const formidable = require('formidable');
const JSONStream = require('JSONStream');
const app = require('../app');

router.post('/upload', async function (req, res, next) {
    const form = new formidable.IncomingForm();
    form.parse(req);
    form.maxFileSize = 200 * 1024 * 1024;
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/../files/' + Date.now() + "-" + file.name.substr(0, file.name.length - 4) + 'txt';
    });
    form.on('file', function (name, file) {
        storeToDb(file, res, req);
    });
});

router.get('/getAnalytics', async function (req, res, nex) {
    req.app.get("io").removeAllListeners();
    let {dateFrom} = req.query;
    let date = new Date(dateFrom).getTime();
    date = date.toFixed(0);
    let counter = 0;
    let data = [];
    let cursor = temperatureModel.find({ts: {$gt: date}}).hint({ts: 1}).sort({ts: -1}).cursor();
    cursor.on('data', function (doc) {
        if (doc) {
            data.push(doc);
            counter++;
            if (counter % 2000 === 0) { // batch size of 2000
                req.app.get("io").emit("analysis", data);
                counter = 0;
                data = [];
            }
        }
    });
    cursor.on('close', function () {
       console.log("done finding");
    });
    res.json({success: true});
});

function storeToDb(file, res, req) {
    try {
        let {path} = file;
        let counter = 0;
        let bulk = temperatureModel.collection.initializeUnorderedBulkOp();
        const dataStreamFromFile = fs.createReadStream(path);
        dataStreamFromFile.pipe(JSONStream.parse('*')).on('data', async (data) => {
            if (data) {
                counter++;
                bulk.insert(data);
                if (counter % 2000 === 0) { // batch size of 2000
                    bulk.execute((err, res) => {
                        if (res)
                            req.app.get("io").emit("dataSaved", counter);
                    });
                    bulk = temperatureModel.collection.initializeUnorderedBulkOp();
                }
            }
        });

        dataStreamFromFile.on('end', async () => {
            fs.unlinkSync(path);
            console.log('Import complete, closing connection...');
            req.app.get("io").emit("dataSaved", "done");
            res.status(200).send("success");
        });
    } catch (e) {
        console.log(e);
        res.status(400).send("error");
    }
}

module.exports = router;
