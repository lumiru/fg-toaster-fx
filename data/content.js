var notifier = document.createElement("div");
notifier.setAttribute("id", "fallengalaxy-fx-addon-notifier");
notifier.setAttribute("style", "display: none");
notifier.addEventListener("notify", function() {
  var data = document.getElementById("fallengalaxy-fx-addon-notifier").textContent;
  self.port.emit("notify", data);
});
document.body.appendChild(notifier);

function inScript() {
  var customEvent = document.createEvent("Event");
  customEvent.initEvent("notify", true, true);
  var notifier = document.getElementById("fallengalaxy-fx-addon-notifier");
  addAlertListener({
    onAlert: function(alert) {
      notifier.textContent = JSON.stringify(alert);
      notifier.dispatchEvent(customEvent);
    }
  });
};
var script = document.createElement("script");
script.appendChild(document.createTextNode('('+String(inScript)+')()'));
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
icon.setAttribute("src", "data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAA\
AAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sM\
AwkzOl7eg64AAANCSURBVDjLBcFNbxtVFAbg95x7Z+zx2HHGrr8mTt04qtoCRaiB\
RhRVCnSDWMEedcEWiR/Ar2DBL0BCggVihdRN2UWlQgkJoZX4qJWmaeLESRwn47HH\
c+cenoe+18DYMPLaUtsjzytQ83LKy0lCnbKXBk5eYTSyw8EEL7cEL34G+j3IhAgi\
ALRjGGHBctlXlVKVVsp181HdlTuPNnixT+zzNEMpz+P7Vey3ItkIR/TrY/DmI+Ez\
EpOpL8vClSpXClWs+RX70Cb08c42bu7HUjuaSvkywVwcc/DkAuF7TVm+vYBG81wi\
NjiGQxP1VYtK8wtyN2jIw+EB1k72VN13xb3mMd90ABMzdgn8oUdOLYciCM12W4r1\
Ph0WLA61U5F2fYEeOCWs7m5TYBJhm7IoQ3SphFbKChdjA98wTCpKeQjAzurVpayX\
H8h/HHZwx+vkVieZWyuHVpUbFkqIyM2QZ0asDG4TwVeMapfkjS/eVNM4rbVv2ZV6\
jbu6WKP3ueZe99PEzfsAC0jPZaBMULrCSI2L3S0DmwlghHLTl3jrHhxhaiOTjnZy\
0kWhHIx6+6RESWMpI2ZBrqpweZzh1Y5F0ScQERQTsmEkRsBO2S9Wl6KAbQCQk0c5\
FPghUGoR/LevwHnnBgQEIUGhqhE0Deau5sCLC0hGgHP/UygPYMToiRsM1donkvMz\
kpLAugWgfhd+GKDVATrLKeZaQKU6RbzTJ61gZfRPRC6G6usuKooPrpF2m3p2orMB\
RLe6hPAWdKuE5PUBXj1LoTRgE8jlKcidw0x6r58dPudf9NEeNitGnnr5/hIJQnbB\
MvhT4u/+oCQCZhOg1gCcIhCfg8ZjZPN1GhzuYWPQsz31OSjxipzmMGlo4iZ5lDcj\
y1GfYQRAChhSuDgSmaWw4SINzw5l/XSPfzo+0c/VZwnS5ALnceTEDoyfXMj8/ja5\
f/0OjvqEccQ4P8jEzPSs2rbHZwe0frJPP56e6N92Z9mIvlWAD/CCS5VhkVd+GNgH\
mmS1IrheAwehFnjEw8TYfyOhpwXGY2WxOcjZs3GCjL5xgL+NiyfIeEuyIoDFIuPd\
G6APWpaXPViMmV/4QusjnW0cGdmLBVGAgr2nY/wPxbF/Ng+RJC4AAAAASUVORK5C\
YII=");
icon.setAttribute("alt", "FG");
widget.appendChild(icon);
document.body.appendChild(widget);
