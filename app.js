const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const axios = require("axios");
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// app.get('/success', (req, res) => {
//     res.sendFile(__dirname + '/success.html')
// })

app.post('/', (req, res) => {
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let email = req.body.email;
    const apiKey = 'd1476129e47aec4ae6f2972119f94859-us2';
    const serverPrefix = 'us2';
    const listId = '0de8dbc8de';
    async function getData() {
        try {
            const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}?skip_merge_validation=false&skip_duplicate_check=false`;
            const response = await axios.post(url, {
                members: [{
                    "merge_fields": {
                        FNAME: firstName,
                        LNAME: lastName
                    },
                    email_address: email,
                    status: 'subscribed'
                }],
                "update_existing": true
            }, {
                headers: {
                    authorization: 'Basic ' + apiKey,
                }
            })
            console.log(response.status)
            res.sendFile(__dirname + '/success.html')
        } catch (e) {
            console.log(e)
            res.sendFile(__dirname + '/failure.html');
        }
    }
    getData();
});

app.post('/failure', (req, res) => {
    res.redirect('/')
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server Started on port 3000");
});