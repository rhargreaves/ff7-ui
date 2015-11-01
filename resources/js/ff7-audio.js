(function(window) {

  var menuSelect = new Audio('resources/sounds/menu_select.mp3');
  var menuLeave = new Audio('resources/sounds/menu_leave.mp3');
  var menuStart = new Audio('resources/sounds/menu_start.mp3');
  var menuError = new Audio('resources/sounds/menu_error.mp3');
  var menuDisplay = new Audio('resources/sounds/menu_display.mp3');

  function play(audio) {
      audio.currentTime = 0;
      audio.play();
  }

	window.ff7.audio = {
		playMenuSelect: function() { play(menuSelect) },
		playMenuLeave: function() { play(menuLeave) },
		playMenuStart: function() { play(menuStart) },
		playMenuError: function() { play(menuError) },
		playMenuDisplay: function() { play(menuDisplay) }
	}

})(window);
