$('.login').focusout(function(){
	var text_val = $(this).val();
	if(text_val === "") {
		$(this).removeClass('has-value');
		$(".login_logo").removeClass('has-bg');
	} else {
		$(this).addClass('has-value');
		$(".login_logo").addClass('has-bg');
	};
});
    
    $('.password').focusout(function(){
	var text_val = $(this).val();
	if(text_val === "") {
		$(this).removeClass('has-value');
		$(".password_logo").removeClass('has-bg');
	} else {
		$(this).addClass('has-value');
		$(".password_logo").addClass('has-bg');
	};
});
    
        $('.login_logo, .password').focusout(function(){
	var text_val = $(this).val();
	if(text_val === "") {
		$(this).removeClass('has-value');
		$(".button_login_logo").removeClass('has-bg');
	} else {
		$(this).addClass('has-value');
		$(".button_login_logo").addClass('has-bg');
	};
});