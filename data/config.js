/*
  Gère les options de configurations dans la fenêtre d'options (options.html).
  Joue les alertes sonores.
*/

// Affichage des configurations
self.port.on("data", function(data) {
  data = JSON.parse(data);
  document.getElementsByTagName("h1")[0].textContent += " " + data.version;
  if(data.storage["sound-battle"]) {
    document.getElementById("sound-battle").checked = true;
    var checkbox = document.getElementById("sound-battle-file");
    checkbox.disabled = false;
    if(data.storage["sound-battle-file"]) {
      checkbox.checked = true;
      document.getElementById("sound-battle-file-get").disabled = false;
      document.getElementById("battleSound").src = data.storage["sound-battle-file"];
    }
  }
  if(data.storage["sound-whisper"]) {
    document.getElementById("sound-whisper").checked = true;
    var checkbox = document.getElementById("sound-whisper-file");
    checkbox.disabled = false;
    if(data.storage["sound-whisper-file"]) {
      checkbox.checked = true;
      document.getElementById("sound-whisper-file-get").disabled = false;
      document.getElementById("whisperSound").src = data.storage["sound-whisper-file"];
    }
  }
});

// Enregistrement des modifications
var inputs = document.getElementsByTagName("input");
var i, j, l;
for(i = -1, l = inputs.length; ++i < l;) {
  inputs[i].addEventListener("change", function() {
    if(this.type == "checkbox") {
      self.port.emit("save", JSON.stringify({key: this.id, value: this.checked}));
      var li = this.parentNode.parentNode.parentNode, l, children, child;
      if(this.checked) {
        children = li.getElementsByTagName("ul")[0].childNodes;
        for(j = -1, l = children.length; ++j < l;) {
          child = children[j];
          if(child.nodeName.toLowerCase() == "li") {
            child = child.getElementsByTagName("input")[0];
            child.disabled = false;
          }
        }
      }
      else {
        children = li.getElementsByTagName("ul")[0].getElementsByTagName("input");
        for(j = -1, l = children.length; ++j < l;) {
          child = children[j];
          if(child.type == "checkbox") {
            child.checked = false;
          }
          child.disabled = true;
        }
      }
    }
    else if(this.type == "file") {
      if(this.id == "sound-battle-file-get") {
        var reader = new FileReader();
        reader.onload = function(rEvent) {
          self.port.emit("save", JSON.stringify({key: "sound-battle-file", value: rEvent.target.result}));
          document.getElementById("battleSound").src = rEvent.target.result;
        };
        reader.readAsDataURL(this.files[0]); // TODO mozFullPath
      }
      else if(this.id == "sound-whisper-file-get") {
        var reader = new FileReader();
        reader.onload = function(rEvent) {
          self.port.emit("save", JSON.stringify({key: "sound-whisper-file", value: rEvent.target.result}));
          document.getElementById("whisperSound").src = rEvent.target.result;
        };
        reader.readAsDataURL(this.files[0]); // TODO mozFullPath
      }
    }
  }, false);
}

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
