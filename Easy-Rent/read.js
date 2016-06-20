console.log('Start loading data from 591')
$.get('https://rent.591.com.tw/index.php?module=search&action=rslist&is_new_list=1&type=1&searchtype=1&region=1&rentprice=3&area=1&kind=2&option=cold,icebox,hotwater,washer,bed,wardrobe&other=balcony_1,cook&order=area&orderType=desc', function(response){
	console.log('Get data from 591');
	$('#container .body').html(response.main);
});

