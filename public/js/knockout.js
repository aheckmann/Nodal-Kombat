$.modal.defaults.overlayClose = true;

var knockout = {
	
	init: function() {
		//login/logout
		$("#login").click(function(){
			$("#login-modal").modal();
		})

	    $(".character-container").live("click", function(){
	      $("#character-selection-container").hide()
	      var waitingMessage = $("#waiting")
	      
	      
	      $(document).bind("gamestart",function(){
	        console.log("adfasdfadfasdfads")
	      	waitingMessage.fadeOut();
	      });
	      
	      level.load('test_level', start); 
	      
	      waitingMessage.fadeIn()
	      
	     
	    })
		  	
		//twitter updates		
	},
	
	updateLeaders: function(data) {
		var leaderBoard = $("ul.leaderboard");
		leaderBoard.empty();		
		$(data).each(function(e) {
			leaderBoard.append('<li> \
				<div class="name">' + this.name +'</div> \
				<div class="avatar"><img src="'+this.avatar+'"></div>\
				<div class="score">' + this.score +'</div>\
				<div class="badges"></div>\
				<div class="rank">' + this.rank + '</div>\
			</li>');
		});
	
	}
	
}

knockout.init();



//Some events
$(".character-container").click(function(){
	$(".character-container").removeClass("selected");
	$(this).addClass("selected");	
})
