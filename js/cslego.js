//要儲存的圖片是10 * 10的方格，oninit時要建立兩個10 * 10的陣列來儲存，一個存形狀，一個存顏色
//每張成品圖都是一個10 * 10的陣列，儲存時記得要將null的空格色碼改為#FFFFFF
//使用者用FB的id來做辨識

var currentShape; //1:左上 2:右上 3:中間 4:左下 5:右下
var currentColor; // #XXXXXX 色碼

var legoAll_Color = new Array(10);

var legoAll_Shape = new Array(10);

//console.log(legoAll_Color);	

var uid;
var accessToken;

var createTable = function(){

}

$(document).ready( function(){
	
	currentShape = 3;
	currentColor = "#3b98bd";
	
	//給每個largePicker的格子一個id，以便後面可以得知使用者點擊了何者
	//給每個largePicker格子加入click event，當使用者點擊時，會將形狀的CSS以及顏色的CSS儲存到二維陣列中，最後畫面的格子再重新對應陣列更新一次
	//點擊設定給td，但是形狀改變是兒子的div
	for(var a = 0; a < 10; a++){
	
		for(var i = 0; i < 10; i++){
			
			var currentBlock = $("table.largePicker tr:nth-child(" + (a+1) + ") td:nth-child(" + (i+1) + ")");
			
			currentBlock.attr("id", a * 10 + i);
			currentBlock.click(function(){ updateTheArray($(this)) });
			
		}
		
	}
	
	//$("table.largePicker tr:first-child td:first-child").attr("id", 1);
	
	///////大方塊每個click結束，都要讓他去跑一次顏色與形狀的更新
	
	//初始化陣列的顏色與形狀，初使顏色為 #FFFFFF，形狀為全滿
	//記得javascript的二維陣列，被儲存的第二維陣列也需要重新宣告
	
	for(var a = 0; a < 10; a++){
		
		legoAll_Color[a] = new Array(10);
		legoAll_Shape[a] = new Array(10);
		
		for(var i = 0; i < 10; i++){
	
			//初始時配置每個顏色都為#FFFFFF，每個的形狀都是代碼3
			legoAll_Color[a][i] = "#FFFFFF";
			legoAll_Shape[a][i] = 3;
	
		}
		
	}

	//Create the right table for lego
	
	$('.minicolors').minicolors({
    	change: function(hex, opacity) {
	        console.log(hex + ' - ' + opacity);
        	changeBlockColor(hex);
        	
        	//將顏色變數存到目前顏色中
        	currentColor = hex;
        	
    	}
    
	});
	
	
	//在左方選取形狀的方格中，加入click event
	//使用者點選想要的格子，要變換外框，讓使用者知道已經選取，所以要先加入click event，變換外框同時改變現在選取的形狀變數
	$('#leftTop, #rightTop, #center, #leftBottom, #rightBottom').click(function(){ 
	
		//將形狀存到現在點擊形狀的變數中
		switch ($(this).context.id){
		
			case "leftTop":
				currentShape = 1;
				break;
				
			case "rightTop":
				currentShape = 2;
				break;
			
			case "center":
				currentShape = 3;
				break;
				
			case "leftBottom":
				currentShape = 4;
				break;
				
			case "rightBottom":
				currentShape = 5;
				break;
		
		}
		
		//改變被點擊者的外框，讓使用者知道是哪個形狀正在被使用
		$('#leftTop, #rightTop, #center, #leftBottom, #rightBottom').removeClass('picked');
		$(this).addClass('picked');
		
	});
	
	//為清除按鈕加入功能，按下去會回復預設陣列
	$('#eraseAll').click(function(){
	
		for(var a = 0; a < 10; a++){
		
			legoAll_Color[a] = new Array(10);
			legoAll_Shape[a] = new Array(10);
		
			for(var i = 0; i < 10; i++){
	
				//初始時配置每個顏色都為#FFFFFF，每個的形狀都是代碼3
				legoAll_Color[a][i] = "#FFFFFF";
				legoAll_Shape[a][i] = 3;
	
			}
		
		}
		
		//清除完要更新所有陣列圖片
		updateThePics();
	
	});

	updateThePics();
	
	addEventOfLoginButton();
	
	addEventOfPublishButton();
	
});

var addEventOfLoginButton = function(){

	//增加登入button的事件
	$("#loginButton").click(function(){
	
		FB.getLoginStatus(function(response) {
		
			if (response.status === 'connected') {
				
				//如果已經授權而且登入，那就直接把#loginButton改成logout狀態
				uid = response.authResponse.userID;
				accessToken = response.authResponse.accessToken;
				
				FB.logout(function(response) {
  					
				});
				
				$("#loginButton").html('Facebook Login');
 				$("#loginButton").removeClass('btn-inverse').addClass('btn-primary');
 				
 				$('#welcome').html("");
				
			} else if (response.status === 'not_authorized') {
			
				// the user is logged in to Facebook, 
				// but has not authenticated your app
				
				 FB.login(function(response) {
				   if (response.authResponse) {
					 
					 //使用者已經登入授權，改變button
					$("#loginButton").html('Facebook Logout');
					$("#loginButton").removeClass('btn-primary').addClass('btn-inverse');
					
					var userName;
				
					FB.api('/me', function(response) {
						userName = response.name;
						$('#welcome').html("Welcome! " + userName);
					});
					 
				   } else {
					 
					 //使用者拒絕登入，button一樣是login
					alert("Please authenticate this application, or you will not be able to create the new lego of your own!");
					 
				   }
				 });
				
			}else {
				
				// the user isn't logged in to Facebook.
				
				FB.login(function(response) {
				   if (response.authResponse) {
					 
					 //使用者已經登入授權，改變button
					$("#loginButton").html('Facebook Logout');
					$("#loginButton").removeClass('btn-primary').addClass('btn-inverse');
					
					var userName;
				
					FB.api('/me', function(response) {
						userName = response.name;
						$('#welcome').html("Welcome! " + userName);
					});
					 
				   } else {
					 
					//使用者拒絕登入，button一樣是login
					alert("Please log in to Facebook, or you will not be able to create the new lego of your own!");
					 
				   }
				 });
				
		  	}
		  	
		 });
		
	});

}

var addEventOfPublishButton = function(){
	
	//加入儲存的功能
	$("#saveButton").click(function(){
	
		var legosCollection = Parse.Object.extend("legosCollection");
		var legos = new legosCollection();
		
		var userId;
				
		FB.api('/me', function(response) {
			
			if(response.id != undefined){
				
				alert("You're now saving the lego");
				
				userId = response.id;
				legos.set("authorId", userId);
				legos.set("colorArray", legoAll_Color);
				legos.set("shapeArray", legoAll_Shape);
				legos.set("isEditOver", true);
				legos.save(null, {
					success: function(){
				
						window.location = "index.html";
			
					}
				});

			}else{
			
				alert("Please login or authorize this app, or you may not be able to publish the lego board!");
			
			}

		});
	
	});

}

var changeBlockColor = function(hex){

	//挪動下調色盤時，上方的區塊顏色要做變化	
	$('table.miniPicker tr:first-child td:first-child div , table.miniPicker tr:first-child td:nth-child(3) div , table.miniPicker tr:nth-child(2) td:nth-child(2) div , table.miniPicker tr:nth-child(3) td:first-child div , table.miniPicker tr:nth-child(3) td:nth-child(3) div').css("background", hex);
	
	//$('table.miniPicker tr:first-child td:first-child div , table.miniPicker tr:first-child td:nth-child(3) div , table.miniPicker tr:nth-child(2) td:nth-child(2) div , table.miniPicker tr:nth-child(3) td:first-child div , table.miniPicker tr:nth-child(3) td:nth-child(3) div').css("background", hex);	

};

var updateTheArray = function(whichObject){

	//把id拉出來，計算出這個格子存在二維陣列的哪兒
	var whereIsTheBlock = whichObject.context.id;
	console.log(whereIsTheBlock);
	
	var firstDimension = Math.floor(whereIsTheBlock / 10);
	var secondDimension = whereIsTheBlock % 10;
	
	console.log(firstDimension + " " + secondDimension);
	
	//currentShape
	//currentColor 
	//把顏色以及形狀更新到兩個二維陣列中
	legoAll_Shape[firstDimension][secondDimension] = currentShape;
	legoAll_Color[firstDimension][secondDimension] = currentColor;
	
	//呼叫更新function updateThePics，即可將圖片按照新陣列作更新
	updateThePics();
	
	pushUpdateToCloud();
}

var pushUpdateToCloud = function(){

	

}

var updateThePics = function(){

	//// legoAll_Color
	//// legoAll_Shape

	for(var a = 0; a < 10; a++){
	
		for(var i = 0; i < 10; i++){
			
			var currentBlock = $("table.largePicker tr:nth-child(" + (a+1) + ") td:nth-child(" + (i+1) + ") div");
			
			//更新顏色
			currentBlock.css("background", legoAll_Color[a][i]);
			
			//更新方塊，先removeclass，再判斷是哪個位置的，使用addclass加入形狀
			currentBlock.removeClass('leftTop rightTop center leftBottom rightBottom');
			
			var whichShape;
			
			switch(legoAll_Shape[a][i]){
				
				//1: leftTop , 2: rightTop , 3: center , 4: leftBottom , 5: rightBottom
				case 1:
					
					whichShape = "leftTop";
					break;
				case 2:
				
					whichShape = "rightTop";
					break;
				case 3:
				
					whichShape = "center";
					break;
				case 4:
				
					whichShape = "leftBottom";
					break;
				case 5:
				
					whichShape = "rightBottom";
					break;
					
			
			}
			
			currentBlock.addClass(whichShape);
		
		}
		
	}

}