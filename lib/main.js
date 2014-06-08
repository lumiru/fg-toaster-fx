var pageMod = require("sdk/page-mod");
const self = require("sdk/self");
const data = self.data;
var storage = require("sdk/simple-storage").storage;
var prefModule = require("sdk/simple-prefs");
var prefs = prefModule.prefs;
// Storage > Vars :
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
			if(alert.type == "whisper-observed" && storage["sound-whisper"]) {
				panel.port.emit("whisper", "");
			}
		});
		worker.port.on("options", function() {
			panel.show();
		});
	};
}

function sendData (panel) {
	panel.port.emit("data", JSON.stringify({name: "Fallen Galaxy", version: self.version, storage: storage}));
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
var panel = require("sdk/panel").Panel({
	contentURL: data.url("options.html"),
	contentScriptFile: data.url("config.js")
});
sendData(panel);
panel.port.on("prefs-required", function() {
	require('sdk/window/utils').getMostRecentBrowserWindow().BrowserOpenAddonsMgr("addons://detail/" + self.id + "/preferences");
	panel.hide();
});

// Chargement des préférences

const prefsToStorage = {
	"snd-whisper-enabled": "sound-whisper",
	"snd-whisper-file": "sound-whisper-file",
};

if(self.loadReason === "upgrade") {
	if(!storage.version) { // < 1.3
		// Loading simple-storage data in browser preferences
		prefs["snd-whisper-enabled"] = storage["sound-whisper"];
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

	sendData(panel);
});
