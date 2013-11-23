/*
  Gère les options de configurations dans la fenêtre d'options (options.html).
  Joue les alertes sonores.
*/

// Affichage des configurations
self.port.on("data", function(data) {
  data = JSON.parse(data);
  document.getElementsByTagName("h1")[0].textContent += " " + data.version;
  if(data.storage["sound-battle"]) {
    if(data.storage["sound-battle-file"]) {
      document.getElementById("battleSound").src = "file://" + data.storage["sound-battle-file"];
    }
  }
  if(data.storage["sound-whisper"]) {
    if(data.storage["sound-whisper-file"]) {
      document.getElementById("whisperSound").src = "file://" + data.storage["sound-whisper-file"];
    }
  }
});

// Lance l'alerte audio
self.port.on("battle", function() {
  var sound = document.getElementById("battleSound");
  sound.volume = 0.5;
  sound.play();
});
self.port.on("whisper", function() {
  var sound = document.getElementById("whisperSound");
  sound.volume = 0.8;
  sound.play();
  //self.port.emit("log", "Whisper!");
});
