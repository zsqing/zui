
var g_post = {
	"switch": "",
	"account": "",
	"ac_host": "",
	"descr": ""
};

$(function(){
	createInitModal();
	verifyEventsInit();
	initEvents();
	initData();
});

function createInitModal() {
	$("#modal_tips").modal({
		"backdrop": "static",
		"show": false
	});
}

function initData() {
	cgicall('AccountList', function(d) {
		if (d.status == 0) {
			g_post.ac_port = d.data.ac_port || "";
			jsonTraversal(d.data, jsTravSet);
			if (typeof d.data.state.state != "undefined" && d.data.state.state == 1 && d.data.switch == 1) {
				$(".connet-account").show().find("p").html(d.data.state.host);
			} else {
				$(".connet-account").hide();
			}
		}
		
	})
}

function initEvents() {
	$('.submit').on('click', saveConf);
}

function saveConf() {
	if (!verification()) return false;
	
	var obj = jsonTraversal(g_post, jsTravGet);
	cgicall('AccountSet', obj, function(d) {
		if (d.status == 0) {
			initData();
			createModalTips("保存成功！");
		} else {
			createModalTips("保存失败！");
		}
	});
}