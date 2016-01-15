var mark1,
	mark2,
	clearInitData;

$(function() {
	$(".title i.spin-load").css("display", "inline-block");
	initEvents();
	initData();
});

function setTimeInitData() {
	if (mark1 == false || mark2 == false) {return}
	clearTimeout(clearInitData);
	clearInitData = setTimeout(function(){
		initData();
   	}, 5000);
}

function initData() {
	mark1 = false,
	mark2 = false;

	ucicall("GetStatus", function(d) {
		if (d.status == 0) {
			setSystem(d.data);
			mark1 = true;
			setTimeInitData();
		} else {
			console.log("获取数据失败！请尝试重新加载！" + (d.data ? d.data : ""));
		}
	});
	
	ucicall("GetEthStatus", function(d) {
		if (d.status == 0) {
			setInterface(d.data);
			mark2 = true;
			setTimeInitData();
		} else {
			console.log("获取数据失败！请尝试重新加载！" + (d.data ? d.data : ""))
		}
	});
}

function setSystem(d) {
	var cpu = 100 - parseInt(d.cpuidle),
		memory = parseInt(d.memorycount) * 100 / parseInt(d.memorymax),
		conncount = parseInt(d.conncount) * 100 / parseInt(d.connmax),
		loadavg = Math.round(d.loadavg[0] /65535 * 100)/100 + ", " + Math.round(d.loadavg[1] /65535 * 100)/100 + ", " + Math.round(d.loadavg[2] /65535 * 100)/100;

	$("#version").html(d.version);
	$("#times").html(d.times);
	$("#uptime").html(arrive_timer_format(d.uptime));
	$("#loadavg").html(loadavg);
	$("#usercount").html(d.usercount);
	
	
	$("#cpuidle").data('radialIndicator').animate(cpu);
	$(".cpuidle").html(cpu + " / " + "100");
	$("#memory").data('radialIndicator').animate(memory);
	$(".memory").html(d.memorycount + " KB / " + d.memorymax + " KB");
	$("#conncount").data('radialIndicator').animate(conncount);
	$(".conncount").html(d.conncount + " / " + d.connmax);
	
	$(".title i.spin-load1").css("display", "none");
}

function setInterface(d) {
	for (var i in d) {
		for (var k in d[i]) {
			if (typeof d[i][k] != "object") {
				if (d[i]["link"] == false) {
					$("." + i + " .zone").css("background-position", "0 0");
				} else {
					$("." + i + " .zone").css("background-position", "0 -39px");
				}

				if (k == "uptime") {
					$("." + i + " ." + k + " span").html(arrive_timer_format(d[i][k]))
				} else {
					$("." + i + " ." + k + " span").html(d[i][k]);
				}
			} else {
				if (d[i][k].length == 1) {
					$("." + i + " .dns1 span").html(d[i][k][0]);
				} else if (d[i][k].length == 2) {
					$("." + i + " .dns1 span").html(d[i][k][0]);
					$("." + i + " .dns2 span").html(d[i][k][1]);
				}
			}
		}
	}
	
	$(".title i.spin-load2").css("display", "none");
}

function initEvents() {
	$('#cpuidle').radialIndicator({
		radius: 24,
		barWidth: 3,
		initValue: 0,
		roundCorner : true,
		percentage: true,
		barBgColor: '#6dd0ef',
		barColor: '#fff'
	});
	$('#memory').radialIndicator({
		radius: 24,
		barWidth: 3,
		initValue: 0,
		roundCorner : true,
		percentage: true,
		barBgColor: '#fad774',
		barColor: '#fff'
	});
	$('#conncount').radialIndicator({
		radius: 24,
		barWidth: 3,
		initValue: 0,
		roundCorner : true,
		percentage: true,
		barBgColor: '#f4866d',
		barColor: '#fff'
	});
}

function arrive_timer_format(s) {
	var t,
		s = parseInt(s);
	if (s > -1) {
		hour = Math.floor(s / 3600);
		min = Math.floor(s / 60) % 60;
		sec = s % 60;
		day = parseInt(hour / 24);
		if (day > 0) {
			hour = hour - 24 * day;
			t = day + "天 " + hour + "时 ";
		} else {
			t = hour + "时 ";  
		} 
		t += min + "分 " + sec + "秒";
	}
	return t;
}


