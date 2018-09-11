var app = getApp();
var globalData = app.globalData;
var base64 = require("base64.min.js");
//获取json 对象长度

function getJsonLength(jsonObj) {
  var Length = 0;
  for (var item in jsonObj) {
    Length++;
  }
  return Length;
}
//时期日期对象
Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
//数组拆分对象 面向对象
Array.prototype.SplitArray = function(len) {
  let result = [];
  for (let i = 0; i < this.length; i += len) {
    result.push(this.slice(i, i + len));
  }
  return result;
};
function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
}
//日期格式化
function fromatDate(fmt, that) {
  console.log("冒泡", fmt);
  var o = {
    "M+": fmt.getMonth() + 1, //月份
    "d+": fmt.getDate(), //日
    "h+": fmt.getHours(), //小时
    "m+": fmt.getMinutes(), //分
    "s+": fmt.getSeconds(), //秒
    "q+": Math.floor((fmt.getMonth() + 3) / 3), //季度
    S: fmt.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (fmt.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
}
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}
//封装网络请求方法
/**
  权限请求  必须关闭缓存
  数据请求  必须开启缓存
  使用方法
  network.GET({
    url:'',
    params:{

    },
    success: function(){

    },
    fail: function(){

    },
    compete:function(){
      
    }
  })
 */
const path = "https://data.api.ppkao.com"; //请求路径
// const path = 'http://192.168.1.180:8081';//请求路径
// const path = 'http://192.168.1.220:8081';//请求路径
const imgPath = "https://upimg.ppkao.com"; //图片路径
const baidu = "https://aip.baidubce.com"; //百度的请求链接
var requestHandler = {
  params: {},
  url: "",
  cache: false, //是否开启缓存
  success: function(res) {
    // 成功
  },
  fail: function() {
    // 失败
  },
  complete: function() {
    //回调
  }
};

//GET请求
function GET(requestHandler) {
  request("GET", requestHandler);
}
//POST请求
function POST(requestHandler) {
  request("POST", requestHandler);
}
//图片请求
function GETPHOTO(requestHandler) {
  request("GETPHOTO", requestHandler);
}
function shouldCache(url) {
  const item = app.globalData.cache[url];
  if (item) {
    return false;
  } else {
    return true;
  }
}
function request(method, requestHandler) {
  //注意：可以对params加密等处理
  var params = requestHandler.params;
  let isHideToast = requestHandler.isHideToast || false; //默认为false
  let argument = "";
  var count = 0;
  console.log(params);
  for (var i in params) {
    argument += i + "=" + params[i] + "&";
    count++;
  }

  argument = argument.substr(0, argument.length - 1);
  console.log(argument);
  var timestamp = Date.parse(new Date());
  timestamp = timestamp / 1000;
  var res = method == "GET" ? path : baidu;
  var url = "";
  res = method == "GETPHOTO" ? imgPath : res;
  method = method == "GETPHOTO" ? "GET" : method;
  if (requestHandler.cache) {
    //+  '&random='+timestamp
    url = res + requestHandler.url + argument + `&source=${globalData.source}`;
  } else {
    url = res + requestHandler.url + argument + `&source=${globalData.source}`;
  }
  console.log(
    "---------------------------请求链接在这里-------",
    url,
    "请求链接在这里--------------------"
  );
  // var request = path + url;
  if (shouldCache(url) || requestHandler.cache) {
    if (!isHideToast) {
      if (wx.showLoading) {
        wx.showLoading({
          title: "数据加载中",
          mask: true
        });
      } else {
        wx.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
    }
    wx.request({
      url: url,
      // data: params,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "content-type":
          method == "post"
            ? "application/x-www-form-urlencoded"
            : "application/json"
      }, // 设置请求的 header   图片上传
      success: function(res) {
        console.log(res, "数据请求结果");
        if (!isHideToast) wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: "数据请求异常",
            image: "/images/loadErr.png"
          });
        }
        //注意：必须是函数
        if (typeof requestHandler.success == "function") {
          app.globalData.cache[url] = res.data;

          requestHandler.success(method == "GET" ? decode(res.data) : res.data);
        }
      },
      fail: function() {
        wx.hideLoading();
        wx.showToast({
          title: "数据请求异常",
          image: "/images/loadErr.png"
        });
        if (typeof requestHandler.fail == "function") {
          requestHandler.fail();
        }
      },
      complete: function() {
        if (typeof requestHandler.complete == "function") {
          requestHandler.complete();
        }
      }
    });
  } else {
    var json = app.globalData.cache[url] || {};
    requestHandler.success(method == "GET" ? decode(json) : json);
  }
}
//比较两个数组是否相等
function compare(array1, array2) {
  return array1.sort().toString() == array2.sort().toString() ? true : false;
}
//base64解密

function decode(obj) {
  const res = {};

  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (Array.isArray(val)) {
      res[key] = [];
      val.forEach(item => {
        res[key].push(decode(item));
      });
    } else if (val instanceof Object) {
      res[key] = decode(val);
    } else {
      res[key] = base64.decode(val);
    }
  });
  return res;
}

//选项提示
function showModal(title, content, fn, cancel, id) {
  if (fn || cancel) {
    wx.showModal({
      title: title ? title : "温馨提示",
      content: content,
      confirmColor: "#419aff",
      // showCancel:false,
      success: function(res) {
        if (res.confirm) {
          fn && fn(id);
        } else {
          cancel && cancel();
        }
      }
    });
  } else {
    wx.showToast({
      title: content,
      duration: 2000,
      image: "/images/subject/tip.png"
    });
  }
}
function redirectToKemu(kmid) {
  const { UserID, UserToken } = wx.getStorageSync("info");
  let id = kmid;
  showModal("温馨提示", "是否切换到该科目", () => {
    console.log(id, "是否存在");
    GET(
      {
        url: "/Interface/KSTKClassAPI.ashx?",
        params: {
          action: "GetKSTKClassModelByID",
          Id: id,
          UserID,
          UserToken
        },
        success: function(res) {
          console.log("数据请求", res);
          if (res.S == 1) {
            let data = res.KSTKList[0];
            wx.setStorageSync("kmid", kmid);
            wx.setStorageSync("tname", data.tname);
            wx.setStorageSync("Kechen", data);
            wx.setStorageSync("ksid", data.kstid);
            wx.setStorageSync("Kemu", data);
            wx.setStorageSync("index", 0);
            wx.switchTab({
              url: "/pages/subject/subject"
            });
          }
        }
      },
      id
    );
  });
}
module.exports = {
  formatTime: formatTime,
  GET: GET,
  POST: POST,
  decode: decode,
  path: path,
  imgPath: imgPath,
  GETPHOTO: GETPHOTO,
  showModal: showModal,
  compare: compare,
  fromatDate: fromatDate,
  getJsonLength: getJsonLength,
  redirectToKemu
};
