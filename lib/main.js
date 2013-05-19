var notifications = require("notifications");
var pageMod = require("page-mod");
const data = require("self").data;
 
pageMod.PageMod({
  include: ["http://ragnarok.fallengalaxy.eu*"],
  contentScriptWhen: 'end',
  contentScript: '\
(function() {\
\
var notifier = document.createElement("div");\
notifier.setAttribute("id", "fallengalaxy-fx-addon-notifier");\
notifier.setAttribute("style", "display: none");\
notifier.addEventListener("notify", function() {\
  var data = document.getElementById("fallengalaxy-fx-addon-notifier").textContent;\
  self.postMessage(data);\
});\
document.body.appendChild(notifier);\
\
var script = document.createElement("script");\
script.appendChild(document.createTextNode(\'\
(function() {\
var customEvent = document.createEvent("Event");\
customEvent.initEvent("notify", true, true);\
var notifier = document.getElementById("fallengalaxy-fx-addon-notifier");\
addAlertListener({\
  onAlert: function(alert) {\
    notifier.textContent = JSON.stringify(alert);\
    notifier.dispatchEvent(customEvent);\
  }\
});\
})();\
\'));\
document.body.appendChild(script);\
\
})();\
  ',
  onAttach: function onAttach(worker) {
    worker.on('message', function(alert) {
      alert = JSON.parse(alert);
      notifications.notify({
        title: "Fallengalaxy : "+(alert.type=="whisper"?"Nouveau message":"Raganarok"),
        text: alert.message,
        iconURL: data.url("icon.png")
      });
    });
  }
});
