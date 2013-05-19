var notifier = document.createElement("div");
notifier.setAttribute("id", "fallengalaxy-fx-addon-notifier");
notifier.setAttribute("style", "display: none");
notifier.addEventListener("notify", function() {
  var data = document.getElementById("fallengalaxy-fx-addon-notifier").textContent;
  self.port.emit("notify", data);
});
document.body.appendChild(notifier);

var script = document.createElement("script");
script.appendChild(document.createTextNode('\
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
})()'));
document.body.appendChild(script);
document.body.removeChild(script);

// Options du module
var widget = document.createElement("div");
widget.setAttribute("title", "Options des alertes");
widget.style.position = "absolute";
widget.style.top = "7px";
widget.style.right = "30px";
widget.style.color = "#ffffff";
widget.style.zIndex = "90";
widget.addEventListener("click", function() {
  self.port.emit("options", "");
}, false);
var icon = document.createElement("img");
icon.setAttribute("src", "http://speedfox.fr.nf/images/fallenico.png");
icon.setAttribute("alt", "FG");
icon.style.height = "16px";
icon.style.width = "16px";
widget.appendChild(icon);
document.body.appendChild(widget);
