var request = require('request');
request('http://api.map.baidu.com/geocoder/v2/?address=%E7%99%BE%E5%BA%A6%E5%A4%A7%E5%8E%A6&output=json&ak=F64993dc30b998170fb40f91439feb0b', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Print the google web page.
    console.dir(JSON.parse(body).result) // Print the google web page.
    console.log()
  }
})
