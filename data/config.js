// Affichage des configurations
self.port.on("data", function(data) {
  data = JSON.parse(data);
  document.getElementsByTagName("h1")[0].textContent += " "+data.version;
  var k = "sound-battle";
  document.getElementById(k).checked = data.storage[k];
});

// Enregistrement des modifications
var inputs = document.getElementsByTagName("input");
for(var i in inputs) {
  inputs[i].addEventListener("change", function() {
    self.port.emit("save", JSON.stringify({key: inputs[i].id,
     value: inputs[i].type=="checkbox"?inputs[i].checked:inputs[i].value}));
  }, false);
}

// Lance l'alerte audio
self.port.on("battle", function() {
  var sound = document.getElementById("battleSound");
  sound.volume = 0.5;
  sound.play();
});
