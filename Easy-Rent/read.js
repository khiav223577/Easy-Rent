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
  var $ul = $('<ul>');
  console.log($data)
  $data.each(function(){
    var $this = $(this);
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
    var $li = $('<li>');
    $li.append($('<div>').html($this.find('.left').html()));
    $li.append($('<div>').html(obj.title)); //標題
    $li.append($('<div>').html(obj.address)); //地址
    $li.append($('<div>').html(obj.floor)); //樓層
    $li.append($('<div>').html(obj.updatedAt)); 
    $li.append($('<div>').html(
      '<span>' + obj.space + '</span>' +    //坪數
      '<span>' + obj.price + '</span>' +  //價格
      '<span>' + obj.peopleNum + '</span>'         //昨日瀏覽       
    ));
    $ul.append($li);
  });
  $('#container .body_591').append($ul);
});

