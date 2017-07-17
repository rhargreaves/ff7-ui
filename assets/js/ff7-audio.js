(function(window) {

  var menuSelect = 'assets/audio/menu_select.mp3';
  var menuLeave = 'assets/audio/menu_leave.mp3';
  var menuStart = 'assets/audio/menu_start.mp3';
  var menuError = 'assets/audio/menu_error.mp3';
  var menuDisplay = 'assets/audio/menu_display.mp3';

  function play(url) {
      new Audio(url).play();
  }

	window.FF7.audio = {
		playMenuSelect: function() { play(menuSelect) },
		playMenuLeave: function() { play(menuLeave) },
		playMenuStart: function() { play(menuStart) },
		playMenuError: function() { play(menuError) },
		playMenuDisplay: function() { play(menuDisplay) }
	}

})(window);
