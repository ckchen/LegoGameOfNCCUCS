
$(document).ready( function(){

	// 讀取Parse資料裡的圖片，將它化成畫面上的陣列
	
	//先計算有多少個圖片
	var legosCollection = Parse.Object.extend("legosCollection");
	var query = new Parse.Query(legosCollection);
	query.equalTo("isEditOver", true);
	query.count({
	
	  success: function(countPics) {
	  
		console.log("總共有" + countPics + "張圖片");
		
		var countPages = Math.ceil(countPics / 3);
		
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
		
		
	
		
	  },
	  error: function(error) {
		
		// The request failed
		
	  }
	});
	
	
	

});


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