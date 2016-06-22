var path_591 = 'https://rent.591.com.tw/'
console.log('Start loading data from 591')
//var searchPath = path_591 + '/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&listview=img&option=cold,hotwater,bed,wardrobe&kind=2&rentprice=3&order=area&orderType=desc&other=cook';
// var searchPath = path_591 + 'index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&rentprice=3&area=1&kind=2&option=cold,icebox,hotwater,washer,bed,wardrobe&other=balcony_1,cook&order=area&orderType=desc';
var row = 0;
var searchPath = path_591 + 'index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&kind=2&rentprice=3&listview=img&order=area&orderType=desc&other=cook&firstRow=';
$('#container .body_591').text('loading...');
$('.load_more').click(function(){
  if (loadingFlag) return;
  row += 20;
  getData();
});
var loadingFlag = false, loadedObj = {};
var $ul;
function getData(){
  $('.load_more').addClass('disabled').text('Loading...');
  loadingFlag = true;
  $.get(searchPath + String(row), function(response){
    loadingFlag = false;
    $('.load_more').removeClass('disabled').text('Load more');
    console.log('Get data from 591');
    response = JSON.parse(response);
    var $data = $(response.main);
    $data.find('img').each(function(){
      var $this = $(this);
      var src = $this.attr('src');
      if (src[0] == '.') $this.attr('src', path_591 + src.substring(1));
    });
    $data.find('a').each(function(){
      var $this = $(this);
      $this.attr('href', path_591 + $this.attr('href'));
    });
    if ($ul == undefined){
      $ul = $('<ul class="house_ul">');
      $('#container .body_591').text('').append($ul);
    }
    console.log($data)
    $data.each(function(){
      var obj = createObjFromRawData($(this));
      if (obj == undefined) return;
      if (loadedObj[obj.id]) return;
      loadedObj[obj.id] = true;
      $ul.append(createHouseFromObj(obj));
    });
  });
}
getData();
function createObjFromRawData($this){
  if ($this.find('.shInfo').length == 0) return;
  var id = $this.find('.left a').attr('href').match("https://rent.591.com.tw/rent-detail-([0-9]+).html")[1];
  if (id == undefined) alert('unknow url: ' + $this.find('.left a').attr('href'));
  return {
    id: id,
    left: $this.find('.left').html(),
    title: $this.find('.right > p:nth-child(1)').html(),
    address: $this.find('.right > p:nth-child(2)').html(),
    floor: $this.find('.right > p:nth-child(3)').html(),
    updatedAt: $this.find('.right > p:nth-child(4)').text().split(' ')[0], //N小時內更新 X先生/小姐
    landlord: $this.find('.right > p:nth-child(4)').text().split(' ')[1],  //N小時內更新 X先生/小姐
    space: $this.find('.rentByArea').text(), //坪數
    price: $this.find('.price strong').text(), //價格
    peopleNum: $this.find('.pattern').text() //昨日瀏覽       
  };
}
function setUserData(key, data){
  var hash = {};
  hash[key] = data;
  chrome.storage.sync.set(hash);
}
function getUserData(key, callback){
  chrome.storage.sync.get(key, function(result){
     callback(result[key]);
  });
}
var currentCategory;
function findTab(category){
  return $('#container > .tabs > [data-category="' + category.replace(/[\""]/g, '\\"') + '"]');
}
function findLi(category){
 return $('.house_li[data-category="' + category.replace(/[\""]/g, '\\"') + '"]'); 
}
function changeToCategory(category){
  if (!category) category = 'Default';
  console.log('change to category: ' + category);
  currentCategory = category;
  $('#container > .tabs > *').removeClass('active');
  findTab(category).addClass('active');
  $('.house_li').hide();
  findLi(category).show();
}
var categoryItenCount = {};
function updateHouseCategory($li, category){
  if (!category) category = 'Default'
  var originCategory = $li.attr('data-category');
  if (originCategory == category) return;
  if (categoryItenCount[category] == undefined) categoryItenCount[category] = 0;
  if (originCategory != undefined) categoryItenCount[originCategory] -= 1;
  categoryItenCount[category] += 1;
  var $tabs = $('#container > .tabs');
  $tab = findTab(category);
  if ($tab.length == 0){
    $tab = $('<div class="btn btn-default">').attr('data-category', category).click(function(){
      changeToCategory(category);
    });
    $tabs.append($tab);
    if (currentCategory == undefined) changeToCategory(category);
  }
  if (originCategory != undefined) findTab(originCategory).text(originCategory + ' (' + String(categoryItenCount[originCategory]) + ')');
  $tab.text(category + ' (' + String(categoryItenCount[category]) + ')');
  $li.attr('data-category', category).toggle(currentCategory == category);
}
function createHouseFromObj(obj){
  console.log('----------------------------');
  console.log(obj);
  var $li = $('<li class="house_li">').text('載入中');
  updateHouseCategory($li);
  getUserData(obj.id, function(data){
    console.log(data)
    var $left = $('<div class="left">').html(obj.left);
    var $right = $('<div class="right">');
    $right.append($('<div>').html(obj.title)); //標題
    $right.append($('<div>').html(
      '<span>' + obj.address + '</span>'
    ));
    $right.append($('<div>').html(
      '<span>' + obj.floor + '</span>'    //樓層
    ));
    $right.append($('<div>').html(
      '<span class="space"> ' + obj.space + ' </span>' +    //坪數
      '<span class="price"> ' + obj.price + ' </span>'   //價格
    ));
    $right.append($('<div class="last_view">').html(
      '<span> 昨日' + obj.peopleNum + '瀏覽 </span>' +          //昨日瀏覽
      '<span> ' + obj.updatedAt + ' </span>'         //N小時內更新
    ));
    $right.append($('<button>').text('搬移').click(function(){
      var input = prompt('請選擇要搬移到的位置');
      updateHouseCategory($li, input);
      setUserData(obj.id, input);
    }));
    updateHouseCategory($li, data);
    $li.text('').append($left).append($right);
  });
  return $li;
}


