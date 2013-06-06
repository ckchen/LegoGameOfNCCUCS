
$(document).ready( function(){

	// 讀取Parse資料裡的圖片，將它化成畫面上的陣列
	
	//先計算有多少個圖片
	var legosCollection = Parse.Object.extend("legosCollection");
	var query = new Parse.Query(legosCollection);
	query.equalTo("isEditOver", true);
	query.count({
	
	  success: function(numberOfObjects) {
	  
		console.log("總共有" + numberOfObjects + "張圖片");
		
		var countPages = Math.ceil(numberOfObjects / 3);
		var howManyObjectsDisplayed = numberOfObjects % 3;
		
		if(countPages == 0){
		
			countPages = 1;
		
		}
		
		//設定pageList的數量
		$("#pageList").paginate({
			count: countPages,
			start: countPages,
			display: countPages,
			border: false,
			text_color: '#888',
			background_color: 'none',	
			text_hover_color: '#2573AF',
			background_hover_color: 'none', 
			images: false,
			mouse: 'press',
			onChange: function(page){
				console.log(page);
			}
		});
		
		//注意，預設的三個欄位（時間、id等）用屬性呼叫，自定欄位要以get method呼叫
		//console.log(editOverObjects[0].get('shapeArray'));
		
		//注意query的上限，預設是100，最高只能到1000，所以盡量用skip與limit來限制拿到的範圍
		//因為一頁只會顯示三個，所以限制一次最多只能retrieve回來三個
		query.limit(3);
		//初始化時，是去顯示最新的作品，所以最後一頁之前的作品可以先不用拿回來
		query.skip((countPages - 1) * 3);
		
		query.find({
		  success: function(results) {
			console.log(results + " : " + results.length);
			addThePicsResultsToPage(results);
		  },
		  error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		  }
		});
		
	  },
	  error: function(error) {
		
		// The request failed
		
	  }
	});
	
	
	

});


var addThePicsResultsToPage = function(legosRetrieved){

	console.log(legosRetrieved[0].get("authorId"));

}

/*

FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
 });
 
 */