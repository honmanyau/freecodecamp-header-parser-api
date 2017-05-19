'use strict'
// client-side js
// run by the browser each time your view template is loaded

// add other scripts at the bottom of index.html
// const dreams = document.getElementById("#dreams");

const xhr = new XMLHttpRequest();
const userInfoContainer = document.getElementById("user-info");

/* Post request */
xhr.open("GET", "/", true);
xhr.onload = (eventA) => {
  // Get user HTTP header information when the page loads
  xhr.open("GET", "/whoami", true);
  xhr.onload = (eventB) => {
    const data = JSON.parse(eventB.target.response);
    
    Object.keys(data).forEach((key) => {
      console.log(data, key, data[key]);
      userInfoContainer.innerHTML += "<li><strong>" + key + "</strong>: " + data[key] + "</li>";
    });
  };
  xhr.send();
};
xhr.send();