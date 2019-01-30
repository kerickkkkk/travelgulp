// $(document).ready(function () {

var xhr = new XMLHttpRequest();
let datalink = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';

//ajax取得資料

var str = "";
var data;

var headerSelect = document.querySelector('.header-select');
var title = document.querySelector('.main-title');
var list = document.querySelector('.list')
var hotarea = document.querySelector('.header-hotarea')

var ZoneArea=[];
var areaStr = "";
//監聽
headerSelect.addEventListener('change', filterArea, false);
hotarea.addEventListener('click', filterHotarea, false);



//執行
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
}


//篩選地區
function filterArea(e) {
  e.preventDefault();
  title.textContent = headerSelect.value;
  areaStr = headerSelect.value;
  updataList(areaStr);
}

// 挑選出有多少行政區
function getsingleArea() {
  var totalArea = [];
  for (var i = 0; i < data.length; i++) {
    totalArea.push(data[i].Zone);
  }
  var zoneStr = "";
  ZoneArea = [...(new Set(totalArea))];
  console.log(ZoneArea); //27個
  for (var i = 0; i < ZoneArea.length; i++) {
    if (i == 0) {
      zoneStr += `<option value="" disabled selected="selected">--請選擇行政區--</option>`;
    } else {
      zoneStr += `<option value="${ZoneArea[i]}">${ZoneArea[i]}</option>`;
    }
  }
  headerSelect.innerHTML = zoneStr;
}

function updataList(areaStr) {
  var placeStr = "";
  for (var i = 0; i < data.length; i++) {
    if (data[i].Zone === areaStr) {
      placeStr += `<div class="col-md-6">
      <div class="card mb-5">
        <div class="card-top-img">
        <span class="bg-lihgt"></span>
          <span class="h4 text-white">${data[i].Name}</span>
          <span class="card-area text-white"> ${data[i].Zone}</span>
          <div class="card-img-top bg-cover " style="background-image: url(${data[i].Picture1});height:155px">
                 
          </div>
        </div>
        <div class="card-body p-3">
          <ul>
            <li class="card-body-opentime">${data[i].Opentime}</li>
            <li class="card-body-addr">${data[i].Add}</li>
            <li class="card-body-tel d-flex justify-content-between">${data[i].Tel}
              <span class="card-body-ticket">${data[i].Ticketinfo}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>`;
    }
    // console.log(placeStr);
    title.innerHTML = areaStr;
    list.innerHTML = placeStr;
  }
}

function filterHotarea(e) {
  e.preventDefault();
  // console.log(e.target.innerHTML)
  // console.log(e.target.nodeName)
  if (e.target.nodeName != "BUTTON") { return }
  areaStr = e.target.innerHTML
  // console.log(areaStr)
  updataList(areaStr)
}



{/* <img  src="${data[i].Picture1}" alt="${data[i].Name}">   */}