// module.exports = function(){}
  var cnst = require("../config");
  var jwt = require('jsonwebtoken');
  var fs = require('fs');
  var oneMin=60000,oneHr = oneMin*60,oneDay = oneHr*24;
  var getTime = function(date){
    if(date == undefined)return new Date().getTime();
    return new Date(date).getTime();
  }
  var getISOTime = function(date){
    try {
      return new Date(date).toISOString();
    } catch (e) {
      return new Date().toISOString();
    }
  }
  // getRemainingMonthDays
  var monthDay = function() {
    var now = new Date(),year=now.getFullYear(),month=now.getMonth()+1,date=now.getDate(),
    totalDays = new Date(year,month,0).getDate();
    return {date: date, total:totalDays , day: month + " / "+date+" / "+year};
  }
  var fullDate = function(date) {
    try {
      var now = date?new Date(date):new Date(),err=null;
    } catch (e) {
      err=e;
      now = new Date();
    } finally {
      var iso = now.toISOString().split("T"),isoD = iso[0].split("-"),isoT = iso[1].split(":");
      var date = now.getDate(),month=now.getMonth(),week = parseInt(date/7),year = now.getFullYear(),utcD = isoD[2]*1;
      fullDay = {
        date : date,week:week,month:month,year:year,
        utcD : utcD,utcW:parseInt(utcD/7),utcM : isoD[1]*1,utcY:isoD[0]*1,
        utcH: isoT[0]*1,utcMn:isoT[1]*1
      }
      if(err)fullDay.error = true
      return fullDay
    }
  }
  var clone = function(obj){
    if(typeof obj === "object" || Array.isArray(obj)){
      return JSON.parse(JSON.stringify(obj));
    }else{
      return obj;
    }
  }
  var random = function(digs){
    var rndn;
    rndn = Math.random();
    if(digs != undefined && !isNaN(digs)){
      rndn =  parseInt(Math.pow(10, digs)*rndn)
    }
    return rndn;
  }
  var isNonEmptyString = function (obj) {
    return (typeof obj === "string" && obj != "");
  }
  var isDefinedObject = function (obj) {
    if(typeof obj != 'object')return false;
    try { JSON.stringify(obj) }
    catch (e) { return false }
    return true;
  }
  var isNonEmptyArray = function (arr){
    return (Array.isArray(arr) && arr.length > 0);
  }
  var isObjectInArray = function(obj, arr){
    if(isNonEmptyArray(obj)){
      for(each in arr){
        if(obj === arr[each])
          return true;
      }
    }
    return false;
  }
  var getDomain = function(email){
    var domain = email.split("@")[1] || "";
    domain = domain.split(".");
    domain.pop();
    return domain.join(".");
  }
  var getIssDomain = function(link){
    var domain = link.split("www.")[1] || "";
    domain = domain.split(".com");
    return domain.join("");
  }
  var btoa = function(str){
    return new Buffer(str).toString('base64');
  }
  var atob = function(str){
    return new Buffer(str,'base64').toString();
  }
  var generateJWToken = function(jwo){
    //creates and returns a token containg object and encripted object
    if(typeof jwo == "object"){
      var bs64 = btoa(JSON.stringify(jwo));
      return bs64+"."+ciphers.createHmac(bs64);
    } else {
      return false;
    }
  }
  var readJWToken = function(tkn){
    //reads token, validates with decrypted token and sends object response.
    try {
      if(!tkn)return false;
      var jwo = tkn.split(".");
      if(jwo.length>1 && ciphers.createHmac(jwo[0])==jwo[1]){
          return JSON.parse(atob(jwo[0]))
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  var readExternalJWToken = function(token){
    //reads token, validates with decrypted token and sends object response.
    var decodeJWT = false,pem_path = cnst.pem_path;
    try {
      var cert = fs.readFileSync(pem_path);
      var decodeJWT = jwt.verify(token,cert);
    } catch (e) {
      // console.log("err : ",e);
    }
    return decodeJWT;
  }


  var Base64 = (function () {
      var digitsStr =
      //   0       8       16      24      32      40      48      56     63
      //   v       v       v       v       v       v       v       v      v
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@$";
      var digits = digitsStr.split('');
      var digitsMap = {};
      for (var i = 0; i < digits.length; i++) {
          digitsMap[digits[i]] = i;
      }
      return {
          fromInt: function(int32) {
              var result = '';
              while (true) {
                  result = digits[int32 & 0x3f] + result;
                  int32 >>>= 6;
                  if (int32 === 0)
                      break;
              }
              return result;
          },
          toInt: function(digitsStr) {
              var result = 0;
              var digits = digitsStr.split('');
              for (var i = 0; i < digits.length; i++) {
                  result = (result << 6) + digitsMap[digits[i]];
              }
              return result;
          }
      };
  })();
  var decTob64 = Base64.fromInt;
  var b64ToDec = Base64.toInt;
  var hexToB64 = function(hStr){
    var limit = 7,sets = parseInt(hStr.length/limit)+(hStr.length%limit == 0?0:1),fnl = "";
    for (var i = 0; i < sets; i++) {
     var chSet = hStr.substring(i*limit,(i+1)*limit);
     fnl += decTob64(parseInt(chSet,16))+"-";
    }
    fnl = fnl.substring(0,fnl.lastIndexOf("-"));
    return fnl+"-"+decTob64(hStr.length);
  }
  var b64ToHex = function(b64Str){
    var baseSpilt = b64Str.split("-"),hexStr = "";
    var fnlLength = b64ToDec(baseSpilt.pop());
    for(var i=0;i<baseSpilt.length;i++){
      var partHex = b64ToDec(baseSpilt[i]).toString(16);
      var diff = 7-partHex.length;
      if(diff){
        if(i!=baseSpilt.length-1)for(var j=0;j<diff;j++)partHex="0"+partHex;
        else {
          var diff2= fnlLength-(hexStr.length+7-diff);
          for(var j=0;j<diff2;j++)partHex="0"+partHex;
        }
      }
      hexStr += partHex;
    }
    return hexStr;
  }
  var randomAlpha = function(length) {
  	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_@";
  	var alph = "",resLength = (isNaN(length) && 6) || length;
  	for( var i=0; i < resLength; i++ )
  		alph += possible.charAt(Math.floor(Math.random() * possible.length));
  	return alph;
  }

  var generateLock = function(company){
    //generate lock id based on time and tandom number - base32 for shortning.
    var tNow = new Date(),rnd = parseInt(Math.random()*64),encode = ciphers.encode,
    timeCrypt = decTob64(tNow.getTime()+""+rnd),
    mainStr = company.toUpperCase().split(" ").join(cnst.splitCh)+"+"+timeCrypt;//lock id consists of company name with timestamp and random in base 36
    var lock = {
      id : hexToB64(encode(mainStr+"+L+1")),
      masterkey: hexToB64(encode(mainStr+"+M+1")),
      readkey:  hexToB64(encode(mainStr+"+R+1")),
      account:company,
      thing:"",
      collectionname:"",
      lastUpdated:tNow
    }
    //result has companyname.randomno.(lock/master/read) information in id/masterkey/readkey
    return lock;
  }
  /**/
  var readLock = function(lock){ // No longer userd
    try {
      lock = b64ToHex(lock);
      var lockprops = ciphers.decode(lock).split("+");
      return {
        account: lockprops[0].split(cnst.splitCh).join(" "),
        lockkey:lockprops[1],
        type:cnst.locktype[lockprops[2]]
      }
    } catch (e) {
      return false;
    }
  }

  function promiseAddOld(name){
    var erP,resP,allFns = [],fnlFn,dummy=function(){},next=true,
    stop = function (con){
      //Stop function stops from propagating to next then. It takes in (optional)comparision and returns true(stop propagation) or false(continue propagation)
      if(con === undefined || con)next=false;
      return !next;
    },//Can be used to stop going to next .then callback function.
    thnFn = function(fnCB,cbname){//all functions from then are added into series of functions and exected one bt one
      allFns.push(fnCB);if(cbname)name=cbname;
      return {then : thnFn,finally: final,error : err}
    },exec = function(er,re){//final function to be called after async call prom.exec
      function sendOut(){
        err = dummy;
        for(var i=0;i<allFns.length;i++){
          try {
            if(next)
            allFns[i](er,re,stop);//execute all functions added to "then" promise.
          } catch (e) {
            err = function(ecb){ecb(e)};
            console.log((name?(name+" : "):"") + "failed at promise ",i+1," with message ",e);
          }
        }
        if(typeof fnlFn == 'function')fnlFn(er,re);//final function is last function to execute.
      }
      if(allFns.length > 0)sendOut();
      else setTimeout(sendOut, 0);
    },
    err = dummy,
    final = function(CB){fnlFn = CB}

    //prom - add functions in sequence using this return method.
    return {
      prom : {then : thnFn,finally: final,error : err},
      post : exec
    }
  }

  function promiseAdd(name){
    var erP,resP,allFns = [],fnlFn,dummy=function(){},next=true, erTrig = false,
    stop = function (con){
      //Stop function stops from propagating to next then. It takes in (optional)comparision and returns true(stop propagation) or false(continue propagation)
      if(con === undefined || con)next=false;
      return !next;
    },//Can be used to stop going to next .then callback function.
    thnFn = function(fnCB,cbname){//all functions from then are added into series of functions and exected one bt one
      allFns.push(fnCB);if(cbname)name=cbname;
      return {then : thnFn,finally: final,error : err}
    },exec = function(er,re){//final function to be called after async call prom.exec
      function sendOut(){
        if(erTrig) {
          err(er, re);
          return;
        }
        // err = dummy;
        for(var i=0;i < allFns.length;i++){
          try {
            if(next) {
              allFns[i](er,re,stop);//execute all functions added to "then" promise.
            }
          } catch (e) {
            err(e || er);
            console.log((name?(name+" : "):"") + "failed at promise ",i+1," with message ",e);
          }
        }
        if(typeof fnlFn == 'function')fnlFn(er,re);//final function is last function to execute.
      }
      if(allFns.length > 0)sendOut();
      else setTimeout(sendOut, 0);
    },
    err = function (cb) {
      err = typeof cb === "function" && cb || dummy;
    },
    final = function(CB){fnlFn = CB}

    //prom - add functions in sequence using this return method.
    return {
      prom : {then : thnFn, finally: final, error : err},
      post : exec,
      error : function (data) {
        erTrig = true;
        exec(data);
      }
    }
  }

  var paginateAggrigate = function(){
    var clb;
    function form(query,respkeys,page,limit,csort,cb){
      /*
      * query     -  query for matching mongo objects
      * respkeys  - keys which shall be there in final object structure
      * page      - page in pagination to use
      * limit     - response limit per call
      * csort     - custom sort: sorting element and order {item:element,order:+-1}
      * cb        - call back to call after reformating object
      * arguments - This is JS list of arguments sent to function.
      */
        if(typeof cb != 'function'){
          for (var i = 0; i < arguments.length; i++) {//itterate all arguments and set callback if its specified earlier before cb.
            if(typeof arguments[i]=='function'){
              clb=arguments[i];delete arguments[i];//set callback
              break;
            }
          }
        } else {
          clb=cb;// set callback to be called after operation.
        }

        if(!page || page < 2 || isNaN(page))page=1;
        var retOb = [
          {$match:query}
         ,{$group: {_id:null,all:{$push : "$$ROOT"},total:{$sum:1}}}
         ,{$unwind: "$all"}
        ],// this will create list of elements and adds "total" object to every bean.
       next={$project:{}},sort={$sort:{}};

       if(csort && (csort.item || Array.isArray(csort))){
         if (respkeys.includes(csort.item)) {
           sort.$sort['all.'+ csort.item]=csort.order;
         } else if (Array.isArray(csort)) {
           for (var i = 0; i < csort.length; i++) {
             var oneItem = csort[i].item;
             if (respkeys.includes(oneItem)){
               sort.$sort['all.'+ oneItem] = csort[i].order;
             }
           }
         }
         if (Object.keys(sort.$sort).length) {
           retOb.push(sort);
         }
       }

       if(page && limit){//limit to paginate number of elements.
         retOb.push({ $skip : (page-1)*limit });
         retOb.push({ $limit: limit });
       } else {
         return [{$match:query}];//if no pagination the simply return basic query.
       }
       if(respkeys){// re create objects with mentioned keys. ex: if we give a,b,c then response obj will only have a,b,c.
         respkeys.forEach(function(v){
           if(v.indexOf(".")==-1)
           next.$project[v] = "$all."+v;
         })
         next.$project.total = "$total";// add total count to final result sets.
         retOb.push(next)
       }
       retOb.push({$group: {_id:null,all:{$push : "$$ROOT"},total:{$first:"$total"}}});//push all objects to key named all and add total key with total objects length.
       retOb.push({$project:{"_id":0,"all":1,"total":1}});
       return retOb;
    }

    function post(err,vl){//this is to be called after data is generated by mongo
      var res = vl;
      if(Array.isArray(vl) && vl.length)res=clone(vl[0]);
      if(res && res.all)
      for (var i = 0; i < res.all.length; i++) {
        delete res.all[i].total;// remove total from individual object set due to agrigation.
        delete res.all[i]._id;
      }
      clb(err,res);
    }

    return {
      form:form,
      post:post
    }

  }

  function aggrigateKeys() {
    var clb=function() {};
    function form(query,respkeys,cb){
      /*
      * query     -  query for matching mongo objects
      * respkeys  - keys which shall be there in final object structure
      */
      if(typeof cb == 'function'){
        clb=cb;// set callback to be called after operation.
      }

      if(!page || page < 2 || isNaN(page))page=1,isUser = (query["account.name"])?true:false;
      var retOb = [
        {$match:query}
      ],// this will create list of elements and adds "total" object to every bean.
      next={$project:{}};

      if(respkeys){// re create objects with mentioned keys. ex: if we give a,b,c then response obj will only have a,b,c.
        respkeys.forEach(function(v){
          next.$project[v] = 1;
        })
        retOb.push(next)
      }
      return retOb;
    }

    function post(err,vl){//this is to be called after data is generated by mongo
      var res = vl;
      clb(err,res);
    }

    return {
      form:form,
      post:post
    }
  }
  function noCase(str) {
    return new RegExp("^"+str+"$","i");
  }
  //*/
  module.exports =  {
    getTime : getTime,
    fullDate:fullDate,
    oneMin:oneMin,
    oneHr:oneHr,
    oneDay:oneDay,
    getISOTime:getISOTime,
    monthDay:monthDay,
    clone : clone,
    random : random,
    getAlpha: randomAlpha,
    isDefinedObject : isDefinedObject,
    isNonEmptyString : isNonEmptyString,
    isNonEmptyArray : isNonEmptyArray,
    isObjectInArray : isObjectInArray,
    getJWToken:generateJWToken,
    readToken:readJWToken,
    readExtToken:readExternalJWToken,
    decTob64:decTob64,
    generateLock:generateLock,
    readLock:readLock,
    getDomain:getDomain,
    getIssDomain:getIssDomain,
    btoa:btoa,
    atob:atob,
    Base64:Base64,
    getpromise:promiseAdd,
    paginate:paginateAggrigate,
    aggKeys:aggrigateKeys,
    noCase:noCase
  }
// }
