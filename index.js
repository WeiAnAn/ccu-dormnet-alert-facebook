// --------------------------------------------------------------
// alert_fb - DormNet System, National Chung Cheng University
// by AnAn 
// last modified: November 28, 2016
// --------------------------------------------------------------
//
// BUG: 機器同時下線可能導致FB 暫時封鎖BOT(垃圾訊息)，
//      可能要等一段時間或是換IP才會恢復，目前不清楚多久。
//
var login = require('facebook-chat-api');
var config = require('./config.js');
var mysql = require('mysql2');
var connection = mysql.createConnection(config.mysql_account);
var conversation = [
	//1175499009210646, //Demo
	1178475045563831, //網管會議
	1362432280452935  //105幹部版
]
var sql = `SELECT description, hostname, status_event_count 
	FROM host
	WHERE status_event_count = 3;`

connection.query(sql, function(err, rows){
	connection.destroy();
	console.log(rows);
	if(err)
		return console.log(err);

	if(rows.length > 0 ){
		login(config.fb_account,function(err, api){
			if(err)
				return console.log(err);

			if(rows.length > 3){
				var message = {
					body: "[爆炸] 一堆機器 下線啦!! 詳見S_monitor"
				};
				for(var j = 0; j < conversation.length; j++){
					api.sendMessage(message,conversation[j],function(err, message){
						if(err)
							console.log(err);
						console.log(message);
					});
				}
			}else{
				for(var i = 0; i < rows.length; i++){
					var message = {
						body: `${rows[i].description} ( ${rows[i].hostname} ) 下線啦!!`
					};
					for(var j = 0; j < conversation.length; j++){
						api.sendMessage(message,conversation[j],function(err, message){
							if(err)
								console.log(err);
							console.log(message);
						});
					}
				}
			}
		});
	}
});
