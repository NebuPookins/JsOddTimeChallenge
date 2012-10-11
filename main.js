$(function() {
	function TS(numer, denom) {
		this.numer = numer;
		this.denom = denom;
	}
	TS.prototype.toString = function() {
		return this.numer + '/' + this.denom;
	};
	function randomTS() {
		var numer = 4, denom = 4;
		switch(Math.floor(Math.random() * 3)) {
		case 0: denom = 4; break;
		case 1: denom = 4; break;
		case 2: denom = 8; break;
		}
		numer = Math.floor((Math.random() * denom * 3.5) + denom / 2);
		return new TS(numer, denom);
	}
	var $setup = $('#setup');
	var $tempo = $setup.find('#tempo');
	var $main = $('#main');
	var $currTS = $main.find('#curr');
	var $nextTS = $main.find('#next');
	var $startBtn = $setup.find('button');
	var $position = $main.find('#position');
	var $click1 = $('audio#click1');
	var $click2 = $('audio#click2');
	function tick(isAccent) {
		if (isAccent) {
			$click1[0].pause();
			$click1[0].currentTime = 0;
			$click1[0].play();
		} else {
			$click2[0].pause();
			$click2[0].currentTime = 0;
			$click2[0].play();
		}
		//var oldBG = $main.css('background');
		//$main.css('background', 'black');
		//setTimeout(function() { $main.css('background', oldBG);}, 50);
	}
	/**
	 * Returns the number of milliseconds between each tick for a given tempo and time signature.
	 * @param tempo the tempo, given as quarter notes per minute.
	 * @param ts an instance of TS.
	 */
	function millisBetweenTicks(tempo, ts) {
		var ticksPerMinute = tempo * ts.denom / 4;
		return 60000 / ticksPerMinute; 
	}
	$startBtn.on('click', function() {
		var tempo = $tempo.val();
		$setup.hide();
		var curTS = new TS(4,4);
		var nextTS = randomTS();
		var currentBeat = 0;
		$currTS.text(curTS.toString());
		$nextTS.text(nextTS.toString());
		$main.show();
		function mainLoop() {
			currentBeat++;
			if (currentBeat > curTS.numer) {
				currentBeat = 1;
				curTS = nextTS;
				nextTS = randomTS();
				$currTS.text(curTS.toString());
				$nextTS.text(nextTS.toString());
			}
			var delay = millisBetweenTicks(tempo, curTS);
			var position = '';
			var i = 1;
			for (; i <= currentBeat; i++) {
				position += '<span>X</span> ';
			}
			for (; i <= curTS.numer; i++) {
				position += '<span>'+i + '</span> ';
			}
			$position.html(position);
			tick(currentBeat == 1);
			setTimeout(mainLoop, delay);
		}
		mainLoop();
	});
});