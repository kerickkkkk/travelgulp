"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// $(document).ready(function () {
var xhr = new XMLHttpRequest();
var datalink = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97'; //ajax取得資料

var str = "";
var data;
var headerSelect = document.querySelector('.header-select');
var title = document.querySelector('.main-title');
var list = document.querySelector('.list');
var hotarea = document.querySelector('.header-hotarea');
var ZoneArea = [];
var areaStr = ""; //監聽

headerSelect.addEventListener('change', filterArea, false);
hotarea.addEventListener('click', filterHotarea, false); //執行

xhr.open('get', datalink, true);
xhr.send(null);

xhr.onload = function () {
  if (xhr.status == 200) {
    str = JSON.parse(xhr.responseText);
    data = str.result.records;
  } else {
    console.log('錯誤');
  }

  getsingleArea();
}; //篩選地區


function filterArea(e) {
  e.preventDefault();
  title.textContent = headerSelect.value;
  areaStr = headerSelect.value;
  updataList(areaStr);
} // 挑選出有多少行政區


function getsingleArea() {
  var totalArea = [];

  for (var i = 0; i < data.length; i++) {
    totalArea.push(data[i].Zone);
  }

  var zoneStr = "";
  ZoneArea = _toConsumableArray(new Set(totalArea));
  console.log(ZoneArea); //27個

  for (var i = 0; i < ZoneArea.length; i++) {
    if (i == 0) {
      zoneStr += "<option value=\"\" disabled selected=\"selected\">--\u8ACB\u9078\u64C7\u884C\u653F\u5340--</option>";
    } else {
      zoneStr += "<option value=\"".concat(ZoneArea[i], "\">").concat(ZoneArea[i], "</option>");
    }
  }

  headerSelect.innerHTML = zoneStr;
}

function updataList(areaStr) {
  var placeStr = "";

  for (var i = 0; i < data.length; i++) {
    if (data[i].Zone === areaStr) {
      placeStr += "<div class=\"col-md-6\">\n      <div class=\"card mb-5\">\n        <div class=\"card-top-img\">\n        <span class=\"bg-lihgt\"></span>\n          <span class=\"h4 text-white\">".concat(data[i].Name, "</span>\n          <span class=\"card-area text-white\"> ").concat(data[i].Zone, "</span>\n          <div class=\"card-img-top bg-cover \" style=\"background-image: url(").concat(data[i].Picture1, ");height:155px\">\n                 \n          </div>\n        </div>\n        <div class=\"card-body p-3\">\n          <ul>\n            <li class=\"card-body-opentime\">").concat(data[i].Opentime, "</li>\n            <li class=\"card-body-addr\">").concat(data[i].Add, "</li>\n            <li class=\"card-body-tel d-flex justify-content-between\">").concat(data[i].Tel, "\n              <span class=\"card-body-ticket\">").concat(data[i].Ticketinfo, "</span>\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>");
    } // console.log(placeStr);


    title.innerHTML = areaStr;
    list.innerHTML = placeStr;
  }
}

function filterHotarea(e) {
  e.preventDefault(); // console.log(e.target.innerHTML)
  // console.log(e.target.nodeName)

  if (e.target.nodeName != "BUTTON") {
    return;
  }

  areaStr = e.target.innerHTML; // console.log(areaStr)

  updataList(areaStr);
}

{
  /* <img  src="${data[i].Picture1}" alt="${data[i].Name}">   */
}
//# sourceMappingURL=all.js.map
