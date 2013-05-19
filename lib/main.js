var notifications = require("notifications");
var pageMod = require("page-mod");
var setTimeout = require("timers").setTimeout;
const data = require("self").data;

var last = 0;
var lstmsgs = [];
 
pageMod.PageMod({
  include: ["http://ragnarok.fallengalaxy.eu*"],
  contentScriptWhen: "end",
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
document.body.removeChild(script);\
\
})();\
  ',
  onAttach: function onAttach(worker) {
    worker.on("message", function(alert) {
      var now = +new Date();
      alert = JSON.parse(alert);
      if(now - last > 20000 || alert.type == "battle") {
        notifications.notify({
          title: "Fallen Galaxy : "+(alert.type=="whisper"?"Nouveau message":"Raganarok"),
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
          }, now - last);
        }
        lstmsgs.push(alert.message);
      }
      last = now;
    });
  }
});
