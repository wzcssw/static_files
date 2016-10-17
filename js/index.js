//电话号码检查
$('.phonenum').keyup(function(){
	test_phonenum = /^(((13[0-9]{1})|(15[012356789]{1})|(18[0-9]{1})|(14[7]{1})|(17[168]{1}))[0-9]{8})$/;
	var phonenum = $(this).val();
	var result = test_phonenum.test(phonenum);
	(result)?$('.check-tip').text(''):$('.check-tip').text('输错啦~再检查一遍!');
})

//送祝福弹层
$('.close').click(function(){$('.wrap-heart').hide()});