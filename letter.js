const express = require("express");
const bodyParser = require("body-parser");
var agent = require('superagent');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    console.log(res.statusCode);
    res.sendFile(__dirname + "/signup.html");
})

var mailchimpInstance = 'us2',
    listUniqueId = '37a6b696dc',
    mailchimpApiKey = 'dd80095e39d8f5dec09809640df1e927-us2';

app.post('/', function (req, res) {
    agent
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer.from('any:' + mailchimpApiKey).toString('base64'))
        .send({
            'email_address': req.body.email,
            'status': 'subscribed',
            'merge_fields': {
                'FNAME': req.body.fName,
                'LNAME': req.body.lName
            }
        })
        .end(function (err, response) {
            if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
});

app.post("/signup", function (req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server Started");
})
