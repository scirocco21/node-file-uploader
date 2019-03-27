'use strict'

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();  //when javascript doesn't do the implication for you...... should != should()
var chaiHttp = require('chai-http');
var path = require('path')

var fs = require("fs")

//console.log("this is a mocha default directory");
//WHY DOES MOCHA EXIT WITH THE THE STATUS CODE EQUALING TO NUMBER OF ERROR INSTEAD OF PRINTING THE ERROR COUNT AND EXITING WITH 0 
//NOTE THIE BEHAVIOR IS ONLY NOTICEABLE WHEN (NPM TEST OR NPM RUN TEST --silent) IS NOT THE CASE
chai.use(chaiHttp);
describe("homepage stuff",()=>{
    it("homepage get",(done)=>
    {
    chai.request("http://localhost:3000").get('/').end(function (err, res) {
        try{
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        (err===null).should.be.true;
        done();   
        }
        catch(err) {
            done(err);
        }
     });
    });

    it("homepage post",(done)=>  
    {
    chai.request("http://localhost:3000").post('/fileupload')
    .attach('filetoupload', fs.readFileSync(path.join(__dirname + '\\Apache-Nginx-Lynx.pdf')), "Apache-Nginx-Lynx.pdf")
    .then(function(response) {
        try{//passing === too harddddddddddddddddddddddddddd
        expect(response.redirects[0]).to.equal('http://localhost:3000/files');
        done();
        }
        catch(err) {
           done(err);
        }
    });
    });

    it("homepage post with random data to not crash server",(done)=>  //that part where you send random data and crashes the server because of accessing obj.null.null
    {
    chai.request("http://localhost:3000").post('/fileupload')
    .type('form')
    .send({
    '_method': 'p',
    'password': '123',
    'confirmPassword': '123'
    }).
    then(function(err, response, body) {
        try{
        expect(err).to.be.not.null;
        done()
        }
        catch(err) {
            done(err);
         }
    });
    
    });

});