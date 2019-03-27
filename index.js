const express = require('express')
const app = express();
const http = require('http');
const path = require('path');
const formidable = require('formidable');
const util = require('util');
const fs = require('fs');
const readline = require('readline');

const port = "https://node-file-uploader.herokuapp.com/"

class File {
  constructor(path, name) {
    this.path = path,
    this.name = name
  }
}

let filesArray = [];

fs.readdir('Library/', (err, data) => {
  data.forEach(file => {
    let newFile = new File(__dirname + "\\Library\\" + file, file);
    filesArray.push(newFile)
  })
});

app.use(express.static('Library'));
app.set('Library', path.join(__dirname, 'Library'));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (request, res) => {
  res.redirect('/fileupload');
})

app.get('/fileupload', (req, res) => {
  res.render('index');  
})

app.post('/fileupload', (req, res) => {
  let form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      if (files.filetoupload) {
        let oldpath = files.filetoupload.path;
        let newpath = path.join(__dirname + '/Library/' + files.filetoupload.name);
        const fileName = files.filetoupload.name;
        // TODO: figure out how to deal with duplicates and deletion of duplicated files
        
        let file = new File(newpath, fileName);
        filesArray.push(file);
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
          res.redirect('./files')
        });
      } else {
        res.status(500).send("Server error.")
      }
    });
})

app.get('/files', (req, res) => {
  const hasContent = !(req.headers["content-type"] === undefined);

  if(hasContent && req.headers["content-type"].localeCompare("application/json" === 0) ){
    let obj = {files: filesArray};
    res.send(JSON.stringify(obj));
    res.end();
  } else {
    res.render('files', {files: filesArray});
  }
 })


 app.get('/files/:name', (req, res) => {
  const hasContent = !(req.headers["content-type"] === undefined);
  if(hasContent && req.headers["content-type"].localeCompare("application/json" === 0) ){
    let selectedFile = filesArray.find(file => {
      return file.name === req.params.name;
    });
    if(selectedFile) 
     res.send(JSON.stringify(selectedFile));
     res.end();
  } else {
   res.status(404).send("Resource not available")
  }
 })

app.post('/files/:name', (req, res) => {
  let selectedFile = filesArray.find(file => {
    return file.name === req.params.name;
  });
  if(selectedFile) {
    let oldPath = selectedFile.path;
    let newPath = path.join(__dirname + '/Delete/' + selectedFile.name);
    fs.renameSync(oldPath, newPath);
    let index = filesArray.indexOf(selectedFile);
    filesArray.splice(index,1);
    res.redirect('/files');
  } else {
    return res.status(404);
  }
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})