var notifications = require("notifications");
var pageMod = require("page-mod");
var tabs = require("tabs");
const data = require("self").data;
 
pageMod.PageMod({
  include: ["http://ragnarok.fallengalaxy.eu*"],
  contentScriptWhen: 'end',
  contentScript: '\
var script = document.createElement("script");\
script.appendChild(document.createTextNode(\'\
var fallengalaxyFXaddonNotify = (function(){\
  var notifier = document.createElement("div");\
  notifier.setAttribute("id", "fallengalaxy-fx-addon-notifier");\
  notifier.setAttribute("style", "display: none");\
  notifier.appendChild(document.createElement("img"));\
  notifier.appendChild(document.createElement("h1"));\
  notifier.appendChild(document.createElement("p"));\
  document.body.appendChild(notifier);\
  return function(img, titre, text) {\
    notifier.getElementsByTagName("img")[0].setAttribute("src", img);\
    notifier.getElementsByTagName("h1")[0].textContent = titre;\
    notifier.getElementsByTagName("p")[0].textContent = text;\
    notifier.click();\
  };\
})();\
addAlertListener({\
  onAlert: function(alert) {\
    fallengalaxyFXaddonNotify("http://fallengalaxy.eu/favicon.png", "Fallengalaxy : "+(alert.type=="whisper"?"Nouveau message":"Raganarok"), alert.message);\
  }\
})\'));\
document.body.appendChild(script);\
document.getElementById("fallengalaxy-fx-addon-notifier").addEventListener("click", function() {\
  self.postMessage(JSON.stringify([this.getElementsByTagName("h1")[0].textContent,\
  this.getElementsByTagName("p")[0].textContent,\
  this.getElementsByTagName("img")[0].getAttribute("src")]));\
}, false);\
  ',
  onAttach: function onAttach(worker) {
    worker.on('message', function(data) {
      data = JSON.parse(data);
      notifications.notify({
        title: data[0],
        text: data[1],
        iconURL: data[2]/*,
        onClick: function() {
          worker.tab.activate();
        }*/
      });
    });
  }
});
