var path_591 = 'https://rent.591.com.tw/'
console.log('Start loading data from 591')
//var searchPath = path_591 + '/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&listview=img&option=cold,hotwater,bed,wardrobe&kind=2&rentprice=3&order=area&orderType=desc&other=cook';
var searchPath = path_591 + 'index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&rentprice=3&area=1&kind=2&option=cold,icebox,hotwater,washer,bed,wardrobe&other=balcony_1,cook&order=area&orderType=desc';
$.get(searchPath, function(response){
  console.log('Get data from 591');
  response = JSON.parse(response);
  var $data = $(response.main);
  $data.find('a').each(function(){
    var $this = $(this);
    $this.attr('href', path_591 + $this.attr('href'));
  });
  var $ul = $('<ul class="house_ul">');
  console.log($data)
  $data.each(function(){
    var $this = $(this);
    if ($this.find('.shInfo').length == 0) return;
    var obj = {
      title: $this.find('.right > p:nth-child(1)').html(),
      address: $this.find('.right > p:nth-child(2)').html(),
      floor: $this.find('.right > p:nth-child(3)').html(),
      updatedAt: $this.find('.right > p:nth-child(4)').text().split(' ')[0], //N小時內更新 X先生/小姐
      landlord: $this.find('.right > p:nth-child(4)').text().split(' ')[1],  //N小時內更新 X先生/小姐
      space: $this.find('.rentByArea').text(), //坪數
      price: $this.find('.price strong').text(), //價格
      peopleNum: $this.find('.pattern').text() //昨日瀏覽       
    };
    var $li = $('<li class="house_li">');
    var $left = $('<div class="left">').html($this.find('.left').html());
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
    $ul.append($li.append($left).append($right));
  });
  $('#container .body_591').text('').append($ul);
});

