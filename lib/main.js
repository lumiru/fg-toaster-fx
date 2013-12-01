var notifications = require("sdk/notifications");
var pageMod = require("sdk/page-mod");
const setTimeout = require("sdk/timers").setTimeout;
const self = require("sdk/self");
const data = self.data;
var storage = require("sdk/simple-storage").storage;
var prefModule = require("sdk/simple-prefs");
var prefs = prefModule.prefs;
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
			if(alert.type != "whisper-observed" && (
					(alert.type == "battle" && storage["notif-battle-enabled"]) ||
					(alert.type == "whisper" && storage["notif-whisper-enabled"])
			)) {
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

// Ancien panneau de configurations - Emplacement des lecteurs audio
var panel = require("panel").Panel({
	contentURL: data.url("options.html"),
	contentScriptFile: data.url("config.js")
});
panel.port.emit("data", JSON.stringify({version:self.version, storage:storage}));
panel.port.on("save", function(data) {
	data = JSON.parse(data);
	storage[data.key] = data.value;
});

// Chargement des préférences

const prefsToStorage = {
	"notif-battle-enabled": "notif-battle-enabled",
	"notif-whisper-enabled": "notif-whisper-enabled",
	"snd-battle-enabled": "sound-battle",
	"snd-whisper-enabled": "sound-whisper",
	"snd-battle-file": "sound-battle-file",
	"snd-whisper-file": "sound-whisper-file",
};

if(self.loadReason === "upgrade") {
	if(!storage.version) { // < 1.3
		// Loading simple-storage data in browser preferences
		storage["notif-battle-enabled"] = prefs["notif-battle-enabled"];
		storage["notif-whisper-enabled"] = prefs["notif-whisper-enabled"];
		prefs["snd-battle-enabled"] = storage["sound-battle"];
		prefs["snd-whisper-enabled"] = storage["sound-whisper"];
		prefs["snd-battle-file"] = storage["sound-battle-file"];
		prefs["snd-whisper-file"] = storage["sound-whisper-file"];
	}
}
else if(self.loadReason === "install") {
	// Loading default preferences in simple-storage
	for(var k in prefsToStorage) {
		storage[prefsToStorage[k]] = prefs[k];
	}
}

// Une fois les changements de version effectués,
// on garde en mémoire le numéro de version pour la prochaine mise à jour
if(self.loadReason !== "startup") {
	storage.version = self.version;
}

prefModule.on("", function (prefName) {
	storage[prefsToStorage[prefName]] = prefs[prefName];

	if((prefName === "snd-battle-enabled" || prefName === "snd-whisper-enabled") && prefs[prefName] === false) {
		var filePrefName = prefName.replace(/-enabled$/g, "") + "-file";
		prefs[filePrefName] = "";
		storage[prefsToStorage[filePrefName]] = prefs[filePrefName];
	}

	panel.port.emit("data", JSON.stringify({version:self.version, storage:storage}));
});
