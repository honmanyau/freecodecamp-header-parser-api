'use strict'
// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use((request, response, next) => {
  console.log(request.method + " " + request.url + " " + request.params);
  next();
})

app.get("/", function (request, response) {
  
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/whoami", function (request, response, next) {
  const headers = request.headers;
  const ipaddress = headers["x-forwarded-for"].match(/^\d+\.\d+\.\d+\.\d+/)[0];
  const language = headers["accept-language"];
  const system = headers["user-agent"].match(/\((.*?)\)/)[1];
  const browserData = headers["user-agent"];
  let browser = "Cannot be determined.  D:";
  let browserVersion = "Cannot be determined.  D:";
  const extension = (str) => {
    const re = new RegExp("(" + str + ")/" + "(.*?)($|\\s)");

    return browserData.match(re);
  };
  
  const isMobile = () => {
    if (browserData.match(/\sMobile/)) {
      browser += " (Mobile)";  
    }
  }
  
  const setBrowserDetails = (str, ver = null) => {
    browser = str;
    
    if (ver) {
      browserVersion = extension(ver)[2]; 
    }
    else {
      browserVersion = extension(str)[2]; 
    }
  };
  
  const setIEDetails = () => {
    browser = "Internet Explorer";
    // Before IE 11
    if (browserData.match(/MSIE\s(\d+\.\d+)/)) {
      browserVersion = browserData.match(/MSIE\s(\d+\.\d+)/)[1];
    }
    // From IE 11
    else if (browserData.match(/rv:(\d+\.\d)/)) {
      browserVersion = browserData.match(/rv:(\d+\.\d)/)[1];
    }
  }
  
  if (extension("Gecko") && extension("Firefox")) {
    setBrowserDetails("Firefox");
  }
  else if (extension("Chrome") && extension("Safari")) {
    setBrowserDetails("Chrome");
  }
  else if (extension("Chrome") && extension("Safari") && extension("OPR")) {
    setBrowserDetails("Opera");
  }
  else if (extension("Version") && extension("Safari")) {
    setBrowserDetails("Safari", "Version");
  }
  else if (extension("Version") && extension("Safari") && extension("Mobile")) {
    setBrowserDetails("Safari", "Version");
  }
  else if (extension("Edge")) {
    setBrowserDetails("Edge");
  }
  else if (extension("Trident")) {
    setIEDetails();
  }
  
  isMobile();
  
  response.json({
    "ipaddress": ipaddress,
    "language": language,
    "system": system,
    "browser": browser,
    "browserversion": browserVersion
  });
  
  next();
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});