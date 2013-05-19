var notifications = require("notifications");
var pageMod = require("page-mod");
const setTimeout = require("timers").setTimeout;
const self = require("self");
const data = self.data;
var storage = require("simple-storage").storage;
// Storage > Vars :
// bool sound-battle - Si vrai, active les notifications sonores pour les combats
// string sound-battle-file - Permet d'utiliser une notification personnalisée
// bool sound-whisper - Si vrai, active les notifications sonores pour les murmures
// string sound-whisper-file - Permet d'utiliser une notification personnalisée

var last = 0;
var lstmsgs = [];

function onAttachMaker(galaxyName) {
	return function(worker) {
		worker.port.on("notify", function(alert) {
			var now = +new Date();
			alert = JSON.parse(alert);

			// Notifications sonores
			if(alert.type == "battle" && storage["sound-battle"]) {
				panel.port.emit("battle", "");
			}
			else if(alert.type == "whisper-observed" && storage["sound-whisper"]) {
				panel.port.emit("whisper", "");
			}

			// Notifications visuelles
			if(alert.type != "whisper-observed") {
				if(now - last > 20000 || alert.type == "battle") {
					notifications.notify({
						title: "Fallen Galaxy : " + (alert.type=="whisper" ? "Nouveau message" : galaxyName),
						text: alert.message,
						iconURL: data.url(alert.type=="battle"?"battle.png":"icon.png")
					});
				}
				else {
					if(lstmsgs.length === 0) {
						setTimeout(function() {
							notifications.notify({
								title: "Fallen Galaxy : Nouveau"+(lstmsgs.length>1?"x":"")+" message"+(lstmsgs.length>1?"s":""),
								text: lstmsgs.join("\n"),
								iconURL: data.url("icon.png")
							});
							lstmsgs = [];
							last = +new Date();
						}, 20000 - (now - last));
					}
					lstmsgs.push(alert.message);
				}
				last = now;
			}
		});
		worker.port.on("options", function() {
			panel.show();
		});
	};
}

pageMod.PageMod({
	include: "http://ragnarok.fallengalaxy.com*",
	contentScriptWhen: "end",
	contentScriptFile: data.url("content.js"),
	onAttach: onAttachMaker("Ragnarok")
});

pageMod.PageMod({
	include: "http://pandora.fallengalaxy.com*",
	contentScriptWhen: "end",
	contentScriptFile: data.url("content.js"),
	onAttach: onAttachMaker("Pandora")
});

// Configurations
var panel = require("panel").Panel({
	contentURL: data.url("options.html"),
	contentScriptFile: data.url("config.js")
});
panel.port.emit("data", JSON.stringify({version:self.version, storage:storage}));
panel.port.on("save", function(data) {
	data = JSON.parse(data);
	storage[data.key] = data.value;
});
