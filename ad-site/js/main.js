(function ($$) {
	var d, header, banner, spinner, imageWr, image, imageMirror, downloadBtnWr, currOrientation;
	var PORTRAIT = 'portrait';
	var LANDSCAPE = 'landscape';
	var BASE_URL = 'http://spherical-cow.herokuapp.com/data';

	function addClass(o, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		if (re.test(o.className)) return;
		o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	}

	function removeClass(o, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	}

	function checkImageDefiningSize() {
		if (!image.naturalHeight || !image.naturalWidth) return;
		if (imageWr.offsetHeight / imageWr.offsetWidth >= image.naturalHeight / image.naturalWidth) {
			removeClass(imageWr, 'definingHeight');
			addClass(imageWr, 'definingWidth');
		} else {
			removeClass(imageWr, 'definingWidth');
			addClass(imageWr, 'definingHeight');
		}
	}

	function getNewImage() {
		setTimeout(function () {
			var img;
			img = d.createElement('img');
			img.onload = function (event) {
				addClass(spinner, 'hidden');
				image.src = img.src;
				imageMirror.src = img.src;
				removeClass(header, 'hidden');
				removeClass(imageWr, 'hidden');
				removeClass(downloadBtnWr, 'hidden');
				checkImageDefiningSize();
			};
			img.src = 'http://image.rakuten.co.jp/kaminorth/cabinet/bicycle01/img60923459.jpg?_ex=128x128';
		}, 3000);
	}

	function initElements() {
		d = document;
		header = $$('.header')[0];
		banner = $$('.banner')[0];
		spinner = $$('.spinner')[0];
		imageWr = $$('.image-wrapper')[0];
		image = $$('.image')[0];
		imageMirror = $$('.image-mirror')[0];
		downloadBtnWr = $$('.download-btn-wrapper')[0];
	}

	/* redundant */
	function setCurrentOrientation(orientation) {
		currOrientation = orientation;
	}

	function checkOrientation(mql) {
		return mql.matches ? PORTRAIT : LANDSCAPE;
	}

	function onScreenOrientationChange(mql) {
		checkImageDefiningSize();
		setCurrentOrientation(checkOrientation(mql));
	}

	function initOrientationWatcher() {
		var mql = window.matchMedia('(orientation: ' + PORTRAIT + ')');
		mql.addListener(onScreenOrientationChange);
		setCurrentOrientation(checkOrientation(mql));
	}

	function initWatchers() {
		initOrientationWatcher();
	}

	function sendGetRequest(url, callback) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				callback(xhr);
			}
		};
		xhr.open("GET", url, true);
		xhr.send();
	}

	window.onload = function () {
		initElements();
		initWatchers();
		getNewImage();
	};

	sendGetRequest(BASE_URL, function (xhr) {
		console.log(xhr);
	});
})(document.querySelectorAll.bind(document));