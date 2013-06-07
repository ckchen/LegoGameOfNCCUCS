var howManyObjects;

$(document).ready( function(){

	// 讀取Parse資料裡的圖片，將它化成畫面上的陣列
	
	//先計算有多少個圖片
	var legosCollection = Parse.Object.extend("legosCollection");
	var query = new Parse.Query(legosCollection);
	query.equalTo("isEditOver", true);
	query.count({
	
	  success: function(numberOfObjects) {
	  
		console.log("總共有" + numberOfObjects + "張圖片");
		
		//將objects數量存到Globale變數中，方便使用
		howManyObjects = numberOfObjects;
		
		var countPages = Math.ceil(numberOfObjects / 3);
		var howManyObjectsDisplayed = numberOfObjects % 3;
		
		if(countPages == 0){
		
			countPages = 1;
		
		}
		
		//設定pageList的數量
		$("#pageList").paginate({
			count: countPages,
			start: countPages,
			display: 20,
			border: false,
			text_color: '#888',
			background_color: 'none',
			text_hover_color: '#2573AF',
			background_hover_color: 'none', 
			images: false,
			mouse: 'press',
			onChange: function(page){
				
				//當使用者點選pagelist，按照對應頁面，去拿回需要的lego pics
				var pageLegosCollection = Parse.Object.extend("legosCollection");
				var pageQuery = new Parse.Query(pageLegosCollection);
				
				pageQuery.limit(3);
				pageQuery.skip((page - 1) * 3);
				
				pageQuery.find({
				  success: function(results) {
					
					//加入fadeout smooth的效果
					$("#displayLegos table").fadeOut("300", function () {

   						addThePicsResultsToPage(results);
   						
					});
					
				  },
				  error: function(error) {
					alert("Error: " + error.code + " " + error.message);
				  }
				});
				
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

	//console.log(legosRetrieved[0].get("authorId"));
	
	//傳進這頁要顯示的數量，創建相對應數量的legos array
	createTheArrayDisplay(legosRetrieved.length);
	
	//跑過底下所有legos的，指定每個lego的格子裡該用什麼屬性
	loopTablesAndAssignCSS(legosRetrieved.length, legosRetrieved);

}  

var createTheArrayDisplay = function(lengthOfDisplayedLegos){

	var fieldToAddDisplay = $('#displayLegos');

	//先清空，再加入顯示
	fieldToAddDisplay.empty();

	for(var legoNumber = 0; legoNumber < lengthOfDisplayedLegos; legoNumber++){
		var content = "<div><p></p><table>"
		for(var addTr = 0; addTr < 10; addTr++){
  			
  			content += '<tr>';
  			
  			for(var addTd = 0; addTd < 10; addTd++){
  			
  				content += '<td><div></div></td>';
  			
  			}
  			
  			content += '</tr>';
		}
		content += "</table></div>"

		fieldToAddDisplay.append(content);
	}
	
	$("#displayLegos table").fadeIn("600");

}

var loopTablesAndAssignCSS = function(lengthOfDisplayedLegos, objectRetrived){

	for(var whichLego = 0; whichLego < lengthOfDisplayedLegos; whichLego++){
		
		$.getJSON('http://graph.facebook.com/' + objectRetrived[whichLego].get('authorId'), function(data) {
		  
			console.log(data.name);
		  
		});
		
		//加入圖片與名字
		$('#displayLegos div:nth-child(' + whichLego +') p').html('<img src="http://graph.facebook.com/' + objectRetrived[whichLego].get('authorId') + '/picture" /><br/><span>' +  + '</span>');
		
		var legoAll_Color = objectRetrived[whichLego].get('colorArray');
		var legoAll_Shape = objectRetrived[whichLego].get('shapeArray');
		
		for(var tableR = 0; tableR < 10; tableR++){
		
			for(var tableD = 0; tableD < 10; tableD++){
				
				//從第一個格子開始assign起
				var whichBlock = $('#displayLegos div:nth-child(' + (whichLego + 1) + ') table tr:nth-child(' + (tableR + 1) + ') td:nth-child(' + (tableD + 1) + ') div');
				
				whichBlock.css("background", legoAll_Color[tableR][tableD]);
			
				var whichShape;
			
				switch(legoAll_Shape[tableR][tableD]){
				
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
			
				whichBlock.addClass(whichShape);
				
			}
		
		}
	
	}

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
