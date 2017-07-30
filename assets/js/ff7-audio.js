(function(window) {

  var sounds = {
    menuSelect: new Audio('assets/audio/menu_select.mp3'),
    menuLeave: new Audio('assets/audio/menu_leave.mp3'),
    menuStart: new Audio('assets/audio/menu_start.mp3'),
    menuError: new Audio('assets/audio/menu_error.mp3'),
    menuDisplay: new Audio('assets/audio/menu_display.mp3')
  }

  for (var key in sounds) {
    var audio = sounds[key];
    audio.load();
  }

  function play(audio) {
      new Audio(audio.src).play();
  }

	window.FF7.audio = {
		playMenuSelect: function() { play(sounds.menuSelect) },
		playMenuLeave: function() { play(sounds.menuLeave) },
		playMenuStart: function() { play(sounds.menuStart) },
		playMenuError: function() { play(sounds.menuError) },
		playMenuDisplay: function() { play(sounds.menuDisplay) },
    play: function(sound) { play(sounds[sound]) }
	}

})(window);
