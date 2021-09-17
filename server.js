const path = require('path');
const express = require('express');
const mongoclient = require('mongodb').MongoClient;
//const watermark = require('purejswatermark');
//const { readSync } = require('fs');

const app = express();
const PORT = 3000;
const uri = 'mongodb://localhost:27017';

app.use('/sample', express.static(path.join(__dirname, 'sample')))
app.use('/', express.static(path.join(__dirname, 'views')))

app.get('/photos', (req, res) => {
    var query = { $or: [{ "description.description": new RegExp(".*" + req.query.search + ".*", "i") }, { "subject.description": new RegExp(".*" + req.query.search + ".*", "i") }] }
    mongoclient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db('lucini');
        dbo.collection("photo").find(query).limit(50).toArray(function (err, result) {
            if (err) throw err;
            var htmlData = '';
            result.forEach(function (elem) {
                try {
                    htmlData = htmlData + '<a style="padding: 20px" href="/sample/' + elem.filename + '" target="_blank"><img src="data:image/png;base64, ' + elem.Thumbnail.base64 + '" /></a>';
                }
                catch { };
                //htmlData = htmlData + elem.subject;

            });
            res.send(htmlData);
            //res.send(result);
            db.close();
        });
    });
});

app.get('/getphotos', (req, res) => {
    var query = { $or: [{ "description.description": new RegExp(".*" + req.query.search + ".*", "i") }, { "subject.description": new RegExp(".*" + req.query.search + ".*", "i") }] }
    var select = { "description.description": 1, "subject.description": 1, "filename": 1, "Thumbnail.base64": 1 };
    mongoclient.connect(uri, function (err, db) {
        if (err) throw err;
        var dbo = db.db('lucini');
        dbo.collection("photo").find(query).project(select).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

app.get('/hello', (req, res) => {
    const imageWithTextWatermark =
         watermark.addTextWatermark(
            './sample/basket27408.jpg',
            { text: 'leopelle', textSize: 8 }
        );
    res.send(imageWithTextWatermark);
    //res.send('Hello photos!');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
