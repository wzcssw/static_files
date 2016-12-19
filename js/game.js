var luckybagscore = 0; // 玉奎
var heartscore = 0; // 周维
var window_width = $(window).width();
var window_height = $(window).height();
var time = 4;
var game_time = 60;
var balls = { 'luckybag-ball': 1, 'lolipop-ball': 1, 'bloom-ball': 2, 'rabbit-ball': 2, 'heart-ball': 1, 'cheng-ball': 1, 'hudi-ball': 1, 'youjin-ball': 1, 'kaile-ball': 1 }; //定义小球个数
$('.start').click(function() {
    $('.settimeout').show();
    time_out();
});
//游戏开始
function game_begin() {
    init_val();
    $('.begin-state').hide();
    $(".gameover").hide();
    $('.game-begin').show();
    var running = setInterval(function() {
        $(".lasttime").html("剩余" + game_time + "秒");
        if (game_time <= 0) {
            console.log('game over');
            game_over(running);
        }
        game_time--;
    }, 1000);
    //添加小球
    $.each(balls, function functionName(k, v) {
        for (v; v > 0; v--) {
            $(".game-area").append("<div class='ball " + k + "'></div>");
        }
    });
    // 启动所有小球
    $(".ball").each(function(i, e) {
        $(e).attr("lock", "false"); // 定义锁
        var balls_type = $(e).attr('class').split(' ')[1];
        $(e).click(function() { // 定义click事件
            ball_click(e, balls_type);
        });
        run(e);
    });
}

function init_val() {
    $(".luckybag-span").html(luckybagscore);
    $(".heart-span").html(heartscore);
}

function run(self) { // 设定随机的启动时间
    setTimeout(function() {
            random_start(self);
        },
        get_random_num(0, 4000)
    );
}

function random_start(self) { //下落
    $(self).css("top", "0px"); //返回页面上端
    $(self).css("marginLeft", get_random_num(0, window_width - 65) + 'px'); // 随机出现位置
    $(self).attr("lock", "false"); //解锁
    $(self).show();
    $(self).animate({
        top: window_height + 150 + 'px'
    }, {
        duration: get_random_num(3000, 4500), // 随机速度 5000, 
        complete: function() { // 落底后再次启动
            $(self).hide();
            run(self);
        }
    });
}

function ball_click(self, balls_type) { //点击小球
    switch (balls_type) {
        case "luckybag-ball":
            if ($(self).attr("lock") == "false") {
                luckybagscore += 1;
                $(self).attr("lock", "true"); // 上锁
                $(".luckybag-span").html(luckybagscore);
            }
            break;
        case "bloom-ball": // 炸弹减分
            if ($(self).attr("lock") == "false") {
                luckybagscore = 0;
                heartscore = 0;
                $(self).attr("lock", "true"); // 上锁
                $(".luckybag-span").html(luckybagscore);
                $(".heart-span").html(heartscore);
            }
            break;
        case "heart-ball": // 加爱心
            if ($(self).attr("lock") == "false") {
                heartscore += 1;
                $(self).attr("lock", "true"); // 上锁
                $(".heart-span").html(heartscore);
            }
            break;
        default:
            if ($(self).attr("lock") == "false") {
                if (luckybagscore > 0) {
                    luckybagscore -= 1;
                }
                if (heartscore > 0) {
                    heartscore -= 1;
                }
                $(self).attr("lock", "true"); // 上锁
                $(".luckybag-span").html(luckybagscore);
                $(".heart-span").html(heartscore);
            }
            break;
    }
    ball_click_animate(self);
}

function ball_click_animate(self) { // 小球被点击动画
    $(self).stop();
    var increase = { marginLeft: "+=-.25rem", marginTop: "+=-.25rem", width: "+=.5rem", height: "+=.5rem" };
    var decrease = { marginLeft: "+=.25rem", marginTop: "+=.25rem", width: "2rem", height: "2.608rem" };
    balls_type = $(self).attr('class').split(' ')[1];
    if (balls_type == 'bloom-ball') {
        $(self).addClass('zha');
        $(self).animate(increase, {
            duration: 150,
            complete: function() {
                $(self).animate(decrease, 50);
                $(self).hide();
                // 动画结束后重新启动
                $(self).removeClass('zha');
                run(self);
            }
        });
    } else {
        $(self).animate(increase, {
            duration: 150,
            complete: function() {
                $(self).animate(decrease, 50);
                $(self).hide();
                // 动画结束后重新启动
                run(self);
            }
        });
    }

}

function get_random_num(min, max) { // 随机数
    var range = max - min;
    var rand = Math.random();
    return (min + Math.round(rand * range));
}

//倒计时
function time_out() {
    if (time > 1) {
        time -= 1;
        pretime = time + 1;
        $('.timeout' + pretime).hide();
        $('.timeout' + time).show();
        setTimeout('time_out()', 1000);
    } else if (time == 1) {
        $('.settimeout').hide();
        game_begin();
    }
}

// 游戏结束
function game_over(obj) {
    $(".game-area").html("");
    $("#_luckybagscore").html(luckybagscore * 2 + heartscore * 1);
    $(".gameover").show();

    // 存储分数
    var storage = window.localStorage;
    if (storage["zhouwei_score"] == undefined && storage["yukui_score"] == undefined && storage["final_score"] == undefined) {
        storage.setItem('zhouwei_score', heartscore);
        storage.setItem('yukui_score', luckybagscore);
        storage.setItem('final_score', luckybagscore * 2 + heartscore * 1);
    }
    window.clearInterval(obj);
}