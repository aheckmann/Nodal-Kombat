$.modal.defaults.overlayClose = true;

var knockout = {
	setPageMode: function(game) {
	if(game) {
		$("#this-game").slideDown()
		$("#leave-game").fadeIn();
	} else {
		$("#this-game").slideUp()
		$("#leave-game").fadeOut();
	}
	
	},
	
	init: function() {
		//login/logout
		$("#login").click(function(){
			$("#login-modal").modal();
		})
		  	
		//twitter updates
		
		//
	}
}

knockout.init();
