const ExifReader = require('exifreader');
const fs = require('fs');
const path = require('path');
const mongoclient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const dirname = '/Users/leonardopellegrini/Documents/Progetti/Exif/sample/';

fs.readdir(dirname, function (err, filenames) {
    if (err) {
        onError(err);
        return;
    }
    filenames = filenames.filter(el => path.extname(el) === '.jpg')
    filenames.forEach(function (filename) {
        fs.readFile(dirname + filename, function (err, data) {
            if (err) {
                return console.log(err);
            }
            const tags = ExifReader.load(data);
            console.log(filename);
            //console.log(tags.subject.description);
            //console.log(tags.description.description);

            var data = { filename: filename };
            try {
                var data = { filename: filename, subject: tags.subject.description, description: tags.description.description };
            }
            catch { }

            mongoclient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
                if (err) throw err;
                console.log("Database created!");
                var dbo = db.db("lucini");
                dbo.collection("photo").insertOne(data, function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    db.close();
                });
            });
        });
    });
});
