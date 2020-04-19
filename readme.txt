
Install node and npm.
Unzip web1
cd web1
npm install
node app.js 


If you want to run as systemd service in Ubuntu.  

vi /etc/systemd/system/web1.service

Create a file in /etc/systemd/system and add the following lines.
---------------------------------------------
[Unit]
Description= web1 start script

[Service]
WorkingDirectory=/home/ubuntu/web1
ExecStart=/usr/bin/node app.js
Restart=always

[Install]
WantedBy=multi-user.target
---------------------------------------------

Then execute following commands.

sudo systemctl daemon-reload
sudo systemctl enable web1.service
sudo systemctl start web1.service

To Check the console logs : 
sudo journalctl -u web1.service

Testing : 

------------------------------------

Test Data 1 : 

curl -X POST -i --header "Content-Type: application/json" \
  --data '{"Shift":2,"Message":"the eagle has landed"}' \
  localhost:23456/api/encode

Output : 

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 41
ETag: W/"29-BImyfyK+DMHpoo1uI0yxgg+Orck"
Date: Sun, 19 Apr 2020 06:51:05 GMT
Connection: keep-alive

{"EncodedMessage":"vjg gcing jcu ncpfgf"}

------------------------------------

Test Data 2 ( No Shift key provided ) : 

curl -X POST -i --header "Content-Type: application/json" \
  --data '{"Message":"the eagle has landed"}' \
  localhost:23456/api/encode

Output : 

HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-5O9eC0qYxOlexVez5VFgpmBq1X8"
Date: Sun, 19 Apr 2020 06:51:42 GMT
Connection: keep-alive

{"EncodedMessage":""}


------------------------------------

TEST 3 : CAPS DATA

curl -X POST -i --header "Content-Type: application/json"   --data '{"Shift":2,"Message":"THE EAGLE"}'   localhost:23456/api/encode
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 30
ETag: W/"1e-HWAuXcmBgOpDHudTbMgEnRzLzJw"
Date: Sun, 19 Apr 2020 16:39:20 GMT
Connection: keep-alive

{"EncodedMessage":"VJG GCING"}


------------------------------------


TEST 4 : NUMERIC IN DATA

curl -X POST -i --header "Content-Type: application/json"  has 1 landed"}'   localhost:23456/api/encode
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 43
ETag: W/"2b-+JcFB+0SpMXDQ78R/gDLqdYgJVM"
Date: Sun, 19 Apr 2020 16:39:46 GMT
Connection: keep-alive

{"EncodedMessage":"vjg gcing jcu 1 ncpfgf"}



------------------------------------

TEST 5 : Negative SHIFT

curl -X POST -i --header "Content-Type: application/json"   --data '{"Shift":-2,"Message":"THE EAGLE HAS"}'   localhost:23456/api/encode
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-Q0kcdDYycCmyxpHBc6mwoWH2JoY"
Date: Sun, 19 Apr 2020 16:40:22 GMT
Connection: keep-alive

{"EncodedMessage":"RFC CYEJC FYQ"}


------------------------------------

 
TEST 6 : NEGATIVE SHIFT WITH BAD CHARACTER

curl -X POST -i --header "Content-Type: application/json"   --data '{"Shift":-22\,"Message":"THE EAGLE HAS"}'   localhost:23456/api/encode
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-5O9eC0qYxOlexVez5VFgpmBq1X8"
Date: Sun, 19 Apr 2020 16:40:39 GMT
Connection: keep-alive

{"EncodedMessage":""}


------------------------------------


TEST 7 : NEGATIVE SHIFT 


curl -X POST -i --header "Content-Type: application/json"   --data '{"Shift":-22,"Message":"THE EAGLE HAS"}'   localhost:23456/api/encode
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-C3nYc0Yuk1Ta1rjEo8tlv+cxbws"
Date: Sun, 19 Apr 2020 16:40:58 GMT
Connection: keep-alive

{"EncodedMessage":"XLI IEKPI LEW"}


------------------------------------


TEST 8 : POSITIVE SHIFT to DECODE test 7

curl -X POST -i --header "Content-Type: application/json"   --data '{"Shift":22,"Message":"XLI IEKPI LEW"}'   localhost:23456/api/encode
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 34
ETag: W/"22-kIBeWzWLpxUqOLJwiCF4dCXjxgY"
Date: Sun, 19 Apr 2020 16:41:22 GMT
Connection: keep-alive

{"EncodedMessage":"THE EAGLE HAS"}


------------------------------------

