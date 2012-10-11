$(function() {
	function assert(bool, msg) {
		if (!bool) throw msg;
	}
	function TS(numer, denom) {
		this.numer = numer;
		this.denom = denom;
	}
	TS.prototype.toString = function() {
		return this.numer + '/' + this.denom;
	};
	var $setup = $('#setup');
	var $tempo = $setup.find('#tempo');
	var $main = $('#main');
	var $currTS = $main.find('#curr');
	var $nextTS = $main.find('#next');
	var $startBtn = $setup.find('button');
	var $position = $main.find('#position');
	var $click1 = $('audio#click1');
	var $click2 = $('audio#click2');
	/**
	 * A list of pairs of (denominator and a list of numerators), e.g.
	 * [
	 *   {denom: 4, numers: [2, 3, 4, 5, 6, 7]},
	 *   {denom: 8, numers: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]}
	 * ]
	 */
	var allowedTS = (function() {
		var result = [];
		$setup.find('li').each(function(index, elem) {
			var $elem = $(elem);
			var $enabled = $elem.find('input[type="checkbox"]');
			if ($enabled.prop('checked')) {
				var enablePrefix = "enable";
				var enableId = $enabled[0].id;
				assert(enableId.indexOf(enablePrefix) == 0, "id was " + enableId);
				var denom = parseInt(enableId.substr(enablePrefix.length));
				var $min = $elem.find('input#min'+denom);
				var $max = $elem.find('input#max'+denom);
				var min = Math.ceil($min.val());
				var max = Math.floor($max.val());
				var numers = [];
				for (var i = min; i <= max; i++) {
					numers.push(i);
				}
				result.push({denom: denom, numers: numers});
			}
		});
		return result;
	})();
	function randomTS() {
		var denomIndex = Math.floor(Math.random() * allowedTS.length);
		var subObj = allowedTS[denomIndex];
		var numerIndex = Math.floor(Math.random() * subObj.numers.length);
		return new TS(subObj.numers[numerIndex], subObj.denom);
	}
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