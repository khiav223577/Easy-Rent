var path_591 = 'https://rent.591.com.tw/'
console.log('Start loading data from 591')
//var searchPath = path_591 + '/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&listview=img&option=cold,hotwater,bed,wardrobe&kind=2&rentprice=3&order=area&orderType=desc&other=cook';
var searchPath = path_591 + 'index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&rentprice=3&area=1&kind=2&option=cold,icebox,hotwater,washer,bed,wardrobe&other=balcony_1,cook&order=area&orderType=desc';
$.get(searchPath, function(response){
	console.log('Get data from 591');
	response = JSON.parse(response);
	console.log(response)
	$('#container .body_591').html(response.main);
	$('#container .body_591 a').each(function(){
		var $this = $(this);
		$this.attr('src', path_591 + $this.attr('src'));
	});
});

