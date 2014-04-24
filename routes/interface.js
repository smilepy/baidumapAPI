
/*
 * GET interface.
 */

var request = require('request');
var Q = require('q');
var API_KEY = 'F64993dc30b998170fb40f91439feb0b';
var API_URI = 'http://api.map.baidu.com/geocoder/v2/?output=json&ak='+API_KEY+'&';
var IP_API_URI='http://api.map.baidu.com/location/ip?ak='+API_KEY+'&';

exports.index = function(req, res){
//  res.send("interface page");
  res.render('lbs/index', {});
};

exports.ip = function(req,res){
  var ip = encodeURIComponent(getClientIp(req));
  ip='';
  var url = IP_API_URI + 'ip='+ip+'&coor=bd09ll';
  showAddressResult(url,res);
}
exports.initl = function(req,res){
  res.render('lbs/initmap',
    {
      curlng:req.params.lng,
      curlat:req.params.lat,
      keyword:'天安门'
    });
}

exports.initw = function(req,res){
  var keyword = encodeURIComponent(req.params.word);
  var url = API_URI + 'address='+keyword;   
  showMapforaddr(url,res,req.params.word);
}

exports.keyword = function(req,res){
  var keyword = encodeURIComponent(req.params.keyword);
  var url = API_URI + 'address='+keyword;   
  showResult(url,res);
}

exports.coord = function(req,res) {

/*
coordtype:
否	
bd09ll	
坐标的类型，目前支持的坐标类型包括：
bd09ll（百度墨卡托坐标）、
gcj02ll（国测局墨卡托坐标）、
wgs84ll（ GPS经纬度）
*/
  
  var coord = encodeURIComponent(req.params.coord);
  var url = API_URI + 'location='+coord;
//  showResult(url,req,res);
  
  showResult(url,res);
}

function getResult(url) {
  var deferred = Q.defer();
  request(url,function(err,res,body){
    if (err && res.statucCode == 200) deferred.reject(err)
    else deferred.resolve(body);
  });
  return deferred.promise;
}
/*
function showResult(url,res) {
  getResult(url).then(function(data){
//  res.send(data);
    res.render('lbs/view', {
      result:data,
      loca:JSON.parse(data).result.location.lng + ',' +JSON.parse(data).result.location.lat
    });  
  }).done();
}
*/
function showResult(url,res) {
  getResult(url).then(function(data){
    //res.send(data);
	var coord = encodeURIComponent(JSON.parse(data).result.location.lat+','+JSON.parse(data).result.location.lng);
    var tempurl = API_URI + 'location='+coord;
	getResult(tempurl).then(function(data){
      res.render('lbs/view', {
      result:JSON.parse(data).result.formatted_address,
      loca:JSON.parse(data).result.location.lng + ',' +JSON.parse(data).result.location.lat
    });  
  }).done();
  }).done();
}

function showMapforaddr(url,res,kword) {
  getResult(url).then(function(data){
    var curstatus=JSON.parse(data).status;
    if(data!=null && curstatus==0)
    {
      res.render('lbs/initmap',
      {
         curdata:data,
         curlng:JSON.parse(data).result.location.lng,
         curlat:JSON.parse(data).result.location.lat,
         keyword:kword
      });
    }
    else
    {
      res.send("status:"+curstatus+",msg:\""+JSON.parse(data).msg+"\"");
    }
  }).done();
}

function showAddressResult(url,res) {
  getResult(url).then(function(data){
    res.render('lbs/view', {
      result:JSON.parse(data).content.address_detail.city+','+JSON.parse(data).content.address_detail.district+','+JSON.parse(data).content.address_detail.province+','+JSON.parse(data).content.address_detail.street+','+JSON.parse(data).content.address_detail.street_number,
      loca:JSON.parse(data).content.point.x + ',' +JSON.parse(data).content.point.y
    });
  }).done();
  
}

function getClientIp(req) { 
 return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress; 
}
