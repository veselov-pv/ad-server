var adModule = (function () {
	var content, header, closeBtn, spinner, imageWr, image, imageMirror,
		downloadBtn, likeBtn, dislikeBtn, stopBtn, shareBtn, baseData;
	var PORTRAIT = 'portrait';
	var LANDSCAPE = 'landscape';
	var BASE_URL = 'https://spherical-cow.herokuapp.com/data';
	var isElementsInited = false;

	function addClass(o, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		if (re.test(o.className)) return;
		o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	}

	function removeClass(o, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
		o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	}

	function isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
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

	function correctImageMirrorPosition() {
		setTimeout(function () {
			imageMirror.style.top = image.offsetTop + image.offsetHeight + 'px';
		}, 100);
	}

	function correctDownloadBtnWidth() {
		downloadBtn.style.width = image.clientWidth + 'px';
	}

	function onImageLoad(event) {
		sendGetRequest(baseData.ads[0].inbox_open);

		event = event || window.event;
		var img = event.target;
		image.onload = function () {
			checkImageDefiningSize();
			correctImageMirrorPosition();
			correctDownloadBtnWidth();
			addClass(spinner, 'hidden');
			removeClass(header, 'hidden');
			removeClass(imageWr, 'hidden');
			removeClass(downloadBtn, 'hidden');
		};
		image.src = img.src;
		imageMirror.src = img.src;

	}

	function getNewImage() {
		var img = document.createElement('img');
		img.onload = onImageLoad;
		img.src = baseData.ads[0].image_url;
	}

	function onElementsInitFinish() {
	}

	function initElements() {
		content = document.querySelector('#ad-content');
		var $get = content.querySelector.bind(content);
		header = $get('.header');
		closeBtn = $get('.btn.close');
		spinner = $get('.spinner');
		imageWr = $get('.image-wrapper');
		image = $get('.image');
		imageMirror = $get('.image-mirror');
		downloadBtn = $get('.btn.download');
		likeBtn = $get('.btn.like');
		dislikeBtn = $get('.btn.dislike');
		stopBtn = $get('.btn.stop');
		shareBtn = $get('.btn.share');
		isElementsInited = true;
		onElementsInitFinish();
	}

	function onScreenOrientationChange() {
		checkImageDefiningSize();
		correctImageMirrorPosition();
		correctDownloadBtnWidth();
	}

	function initOrientationListener() {
		var mql = window.matchMedia('(orientation: ' + PORTRAIT + ')');
		mql.addListener(onScreenOrientationChange);
	}

	function removeAllElements() {
		if (content) content.parentNode.removeChild(content);
	}

	function redirectToAdSite() {
		window.location.href = baseData.ads[0].click_url;
	}

	function initListeners() {
		initOrientationListener();
		closeBtn.onclick = removeAllElements;
		image.onclick = redirectToAdSite;
		downloadBtn.onclick = redirectToAdSite;
		likeBtn.onclick = function () {
			sendGetRequest(baseData.ads[0].ad_like);
		};
		dislikeBtn.onclick = function () {
			sendGetRequest(baseData.ads[0].ad_dislike);
		};
		stopBtn.onclick = function () {
			sendGetRequest(baseData.ads[0].ad_hide);
		};
		shareBtn.onclick = function () {
			sendGetRequest(baseData.ads[0].ad_share);
		};
	}

	function sendGetRequest(url, callback) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4 || xhr.status !== 200) return;
			if (typeof callback == 'function') callback(xhr);
		};
		xhr.open("GET", url, true);
		xhr.send();
	}

	function sendInitialRequest() {
		sendGetRequest(BASE_URL, function (xhr) {
			if (!isJsonString(xhr.responseText)) return;
			baseData = JSON.parse(xhr.responseText);
			if (isElementsInited === true) {
				getNewImage();
			} else {
				onElementsInitFinish = getNewImage;
			}
		});
	}

	return {
		init: function () {
			sendInitialRequest();
			initElements();
			initListeners();
		}
	}
})();