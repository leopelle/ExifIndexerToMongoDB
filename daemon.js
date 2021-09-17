const ExifReader = require("exifreader");
const fs = require("fs");
const path = require("path");
const mongoclient = require("mongodb").MongoClient;

const uri = "mongodb://localhost:27017";
const dirname = "/Users/leonardopellegrini/Documents/Progetti/Exif/sample/";
var v = [];

fs.readdir(dirname, function (err, filenames) {
  if (err) throw err;

  filenames = filenames.filter(
    (el) => path.extname(el).toLowerCase() === ".jpg"
  );
  const promises = filenames.map((filename) => ReadExif(filename));
  Promise.all(promises).then((values) => {
    mongoclient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("lucini");
      dbo.collection("photo").insertMany(v, function (err, res) {
        if (err) throw err;
        console.log("documents inserted");
        db.close();
      });
    });
  });
});

function ReadExif(filename) {
  var promise = new Promise(function (resolve, reject) {
    fs.readFile(dirname + filename, function (err, data) {
      if (err) throw err;
      const tags = ExifReader.load(data);
      console.log(filename);
      console.log(tags.subject.description);
      console.log(tags.description.description);
      if (tags.Category !== undefined) {
        console.log(tags.Category.description);
      }
      if (tags.City !== undefined) {
        console.log(tags.City.description);
      }
      if (tags["Province/State"] !== undefined) {
        console.log(tags["Province/State"].description);
      }
      if (tags["Country/Primary Location Code"] !== undefined) {
        console.log(tags["Country/Primary Location Code"].description);
      }
      if (tags.Credit !== undefined) {
        console.log(tags.Credit.description);
      }

      console.log(tags.Keywords);
      //console.log(tags);
      /*
            var res = { filename: filename };
            try {
                res = { filename: filename, subject: tags.subject.description, description: tags.description.description, city: tags.City.description, author: tags.creator.description, caption: tags['Caption/Abstract'].description, keywords: tags.keywords.description };
            }
            catch { }
            */

      tags.filename = filename;

      v.push(tags);
      resolve();
    });
  });
  return promise;
}
