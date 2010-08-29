$.modal.defaults.overlayClose = true;

var knockout = {
	
	init: function() {
		//login/logout
		$("#login").click(function(){
			$("#login-modal").modal();
		})
		  	
		//twitter updates		
	}
}

knockout.init();



//Some events
$(".character-container").click(function(){
	$(".character-container").removeClass("selected");
	$(this).addClass("selected");	
})