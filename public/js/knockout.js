$.modal.defaults.overlayClose = true;

var sampleData = [
		{
			name: "Bilbo",
			avatar: "http://0.gravatar.com/avatar/987da1e668e6eb5cde64b52a477764ec?s=69&d=identicon",
			score: 10,
			rank: 1
		},
		
		{
			name: "Frodo",
			avatar: "http://0.gravatar.com/avatar/987da1e668e6eb5cde64b52a477764ec?s=69&d=identicon",
			score: 8,
			rank: 2
		},
		
		{
			name: "Mr. Eyball",
			avatar: "http://0.gravatar.com/avatar/987da1e668e6eb5cde64b52a477764ec?s=69&d=identicon",
			score: 5,
			rank: 3
		},
	];

var knockout = {
	
	init: function() {
		//login/logout
		$("#login").click(function(){
			$("#login-modal").modal();
		})

	    $(".character-container").live("click", function(){
	      $("#character-selection-container").hide()
	      var waitingMessage = $("#waiting");
	      var instruction = $("#instruction");
	      
	      $(document).bind("gamestart",function(){
	      	waitingMessage.fadeOut();
	      	instruction.animate({right:'0px',top:'0px'})
	      });
	      
	      level.load('test_level', start); 
	      
	      waitingMessage.fadeIn();
	      instruction.fadeIn();
	      
	     
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
