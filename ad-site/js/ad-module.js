var adModule = new function () {
	var content, closeBtn, spinner, imageWr, image, imageMirror,
		downloadBtn, likeBtn, dislikeBtn, stopBtn, shareBtn, baseData,
		onElementsInitFinish, t;
	var PORTRAIT = 'portrait';
	//var LANDSCAPE = 'landscape';
	var BASE_URL = 'https://spherical-cow.herokuapp.com/data';
	var isElementsInited = false;

	return {
		addClass: function (o, c) {
			var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
			if (re.test(o.className)) return;
			o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		},

		removeClass: function (o, c) {
			var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
			o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		},

		isJsonString: function (str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},

		deferredRun: function (callback, delay, times) {
			times -= 1;
			var self = this;
			setTimeout(function () {
				callback();
				if (times) self.deferredRun(callback, delay, times);
			}, delay);
		},

		getSummaryOffset: function (element) {
			var top = 0, left = 0;
			do {
				top += element.offsetTop || 0;
				left += element.offsetLeft || 0;
				element = element.offsetParent;
			} while (element);

			return {
				top: top,
				left: left
			};
		},

		checkImageDefiningSize: function () {
			if (!image.naturalHeight || !image.naturalWidth) return;
			if (imageWr.offsetHeight / imageWr.offsetWidth >= image.naturalHeight / image.naturalWidth) {
				t.removeClass(imageWr, 'definingHeight');
				t.addClass(imageWr, 'definingWidth');
			} else {
				t.removeClass(imageWr, 'definingWidth');
				t.addClass(imageWr, 'definingHeight');
			}
			t.removeClass(image, 'not-visible');
		},

		correctImageMirrorPosition: function () {
			imageMirror.style.top = image.offsetTop + image.offsetHeight + 'px';
			t.removeClass(imageMirror, 'not-visible');
		},

		correctDownloadBtnWidthAndPosition: function () {
			downloadBtn.style.width = image.clientWidth + 'px';
			var imageSummaryOffsetPos = t.getSummaryOffset(image);
			downloadBtn.style.left = imageSummaryOffsetPos.left + 'px';
			downloadBtn.style.top = imageSummaryOffsetPos.top + image.offsetHeight + 15 + 'px';
			t.removeClass(downloadBtn, 'not-visible');
		},

		recheckElements: function () {
			t.addClass(image, 'not-visible');
			t.checkImageDefiningSize();
			t.addClass(imageMirror, 'not-visible');
			t.deferredRun(t.correctImageMirrorPosition, 30, 3);
			t.addClass(downloadBtn, 'not-visible');
			t.deferredRun(t.correctDownloadBtnWidthAndPosition, 30, 3);
		},

		onImageLoad: function () {
			t.sendGetRequest(baseData.ads[0].inbox_open);
			t.addClass(spinner, 'hidden');
			t.removeClass(imageWr, 'hidden');
			t.recheckElements();
		},

		getNewImage: function () {
			image.src = baseData.ads[0].image_url;
			image.onload = t.onImageLoad;
			imageMirror.src = baseData.ads[0].image_url;
		},

		initElements: function () {
			content = document.querySelector('#ad-content');
			var $get = content.querySelector.bind(content);
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
			if (typeof onElementsInitFinish == 'function') onElementsInitFinish();
		},

		onScreenOrientationChange: function () {
			t.recheckElements();
		},

		initOrientationListener: function () {
			var mql = window.matchMedia('(orientation: ' + PORTRAIT + ')');
			mql.addListener(t.onScreenOrientationChange);
		},

		removeAllElements: function () {
			if (content) content.parentNode.removeChild(content);
		},

		redirectToAdSite: function () {
			window.location.href = baseData.ads[0].click_url;
		},

		initListeners: function () {
			t.initOrientationListener();
			closeBtn.onclick = t.removeAllElements;
			image.onclick = t.redirectToAdSite;
			downloadBtn.onclick = t.redirectToAdSite;
			likeBtn.onclick = function () {
				t.sendGetRequest(baseData.ads[0].ad_like);
			};
			dislikeBtn.onclick = function () {
				t.sendGetRequest(baseData.ads[0].ad_dislike);
			};
			stopBtn.onclick = function () {
				t.sendGetRequest(baseData.ads[0].ad_hide);
			};
			shareBtn.onclick = function () {
				t.sendGetRequest(baseData.ads[0].ad_share);
			};
		},

		sendGetRequest: function (url, callback) {
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4 || xhr.status !== 200) return;
				if (typeof callback == 'function') callback(xhr);
			};
			xhr.open("GET", url, true);
			xhr.send();
		},

		sendInitialRequest: function () {
			t.sendGetRequest(BASE_URL, function (xhr) {
				if (!t.isJsonString(xhr.responseText)) return;
				baseData = JSON.parse(xhr.responseText);
				if (isElementsInited === true) {
					t.getNewImage();
				} else {
					onElementsInitFinish = t.getNewImage;
				}
			});
		},

		init: function () {
			t = this;
			t.sendInitialRequest();
			t.initElements();
			t.initListeners();
		}
	}
};

if (typeof exports != 'undefined') exports.adModule = adModule;