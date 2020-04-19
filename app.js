
const express = require('express');
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/encode', function(req, res) {

	let shift = req.body.Shift;
	let message  = req.body.Message;

	if(!shift || !message){
		console.log(
			"This endpoint expects a JSON string to be received." +
			"The JSON structure should have a key Shift and Message." +
			"Key's value should be an integer and  Message’s value should be a string."
		);
		throw Error("Internal Server Error");
	}

	if (typeof shift !== 'number') {
    	console.log('Shift’s value should be an integer');
    	throw Error("Internal Server Error");
	}
   
    var encoded_message = cipherShift(shift, message);
    
    fs.writeFile("EncodedMessage.txt", encoded_message, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The EncodedMessage was saved to EncodedMessage.txt");
   });
   	
   res.send({
	  EncodedMessage:encoded_message
   });

});

var cipherShift = function(shift, message) {

    if (shift < 0)
        return cipherShift(shift + 26, message);

        let output = '';

        for (let i = 0; i < message.length; i ++) {
            let c = message[i];
            if (c.match(/[a-z]/i)) {
                // Get its code
                var code = message.charCodeAt(i);
                // Uppercase letters
                if ((code >= 65) && (code <= 90))
                   c = String.fromCharCode(((code - 65 + shift) % 26) + 65);
                // Lowercase letters
                else if ((code >= 97) && (code <= 122))
                   c = String.fromCharCode(((code - 97 + shift) % 26) + 97);
	        }
	        output += c;
        }
       return output; 
}

// error handler middleware
app.use((error, req, res, next) => {
	res.status(500).send({
	  EncodedMessage:""
	});
});

const PORT = process.env.PORT || 23456 ;

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
