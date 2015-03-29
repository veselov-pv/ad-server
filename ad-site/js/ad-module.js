/** @namespace */
var adModule = new function () {
	/**
	 * DOM elements from HTML page. Initialize in adModule.initElements()
	 * @private
	 * @type {HTMLElement}
	 */
	var content, closeBtn, spinner, imageWr, image, imageMirror,
		downloadBtn, likeBtn, dislikeBtn, stopBtn, shareBtn;
	/**
	 * @private
	 * @type {boolean}
	 */
	var isElementsInited = false;
	/**
	 * Callback function for adModule.initElements()
	 * @private
	 * @type {(undefined | function)}
	 */
	var onElementsInitFinish = null;
	/**
	 * Link to adModule for internal use
	 * @private
	 * @type {object}
	 */
	var t;
	/**
	 * String variable for check device orientation in adModule.initOrientationListener();
	 * @private
	 * @const
	 * @type {string}
	 */
	var PORTRAIT = 'portrait';
	/**
	 * String value like base URL for getting data in adModule.sendInitialRequest()
	 * @private
	 * @const
	 * @type {string}
	 */
	var BASE_URL = 'https://spherical-cow.herokuapp.com/data';
	/**
	 * Object loads in adModule.sendInitialRequest(). Object containing URLs for image loading (adModule.getNewImage()) and GET requests.
	 * @private
	 * @type {object}
	 */
	var baseData;

	return {
		/**
		 * Used for adding class name to HTMLElement class name list
		 * @function adModule.addClass
		 * @param o {HTMLElement} The DOM element which class name will be extended
		 * @param c {string} Class name. Will be added to DOM element class name
		 */
		addClass: function (o, c) {
			var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
			if (re.test(o.className)) return;
			o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		},

		/**
		 * Used for removing class name from HTMLElement class name list
		 * @function adModule.removeClass
		 * @param o {HTMLElement} The DOM element which class name will be shrink
		 * @param c {string} Class name. Will be removed from DOM element class name
		 */
		removeClass: function (o, c) {
			var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
			o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		},
		/**
		 * Used for validating of string by JSON format
		 * @function adModule.isJsonString
		 * @param str {string}
		 * @returns {boolean} true if validated like JSON
		 */
		isJsonString: function (str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		/**
		 * @function adModule.deferredRun
		 * @param callback
		 * @param delay
		 * @param times
		 */
		deferredRun: function (callback, delay, times) {
			times -= 1;
			var self = this;
			setTimeout(function () {
				callback();
				if (times) self.deferredRun(callback, delay, times);
			}, delay);
		},
		/**
		 * @function adModule.getSummaryOffset
		 * @param element
		 * @returns {{top: number, left: number}}
		 */
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
		/**
		 * @function adModule.checkImageDefiningSize
		 */
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
		/**
		 * @function adModule.correctImageMirrorPosition
		 */
		correctImageMirrorPosition: function () {
			imageMirror.style.top = image.offsetTop + image.offsetHeight + 'px';
			t.removeClass(imageMirror, 'not-visible');
		},
		/**
		 * @function adModule.correctDownloadBtnWidthAndPosition
		 */
		correctDownloadBtnWidthAndPosition: function () {
			downloadBtn.style.width = image.clientWidth + 'px';
			var imageSummaryOffsetPos = t.getSummaryOffset(image);
			downloadBtn.style.left = imageSummaryOffsetPos.left + 'px';
			downloadBtn.style.top = imageSummaryOffsetPos.top + image.offsetHeight + 15 + 'px';
			t.removeClass(downloadBtn, 'not-visible');
		},
		/**
		 * @function adModule.recheckElements
		 */
		recheckElements: function () {
			t.addClass(image, 'not-visible');
			t.checkImageDefiningSize();
			t.addClass(imageMirror, 'not-visible');
			t.deferredRun(t.correctImageMirrorPosition, 30, 3);
			t.addClass(downloadBtn, 'not-visible');
			t.deferredRun(t.correctDownloadBtnWidthAndPosition, 30, 3);
		},
		/**
		 * @function adModule.onImageLoad
		 */
		onImageLoad: function () {
			t.sendGetRequest(baseData.ads[0].inbox_open);
			t.addClass(spinner, 'hidden');
			t.removeClass(imageWr, 'hidden');
			t.recheckElements();
		},
		/**
		 * @function adModule.getNewImage
		 */
		getNewImage: function () {
			image.src = baseData.ads[0].image_url;
			image.onload = t.onImageLoad;
			imageMirror.src = baseData.ads[0].image_url;
		},
		/**
		 * @function adModule.initElements
		 */
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
		/**
		 * @function adModule.onScreenOrientationChange
		 */
		onScreenOrientationChange: function () {
			t.recheckElements();
		},
		/**
		 * @function adModule.initOrientationListener
		 */
		initOrientationListener: function () {
			var mql = window.matchMedia('(orientation: ' + PORTRAIT + ')');
			mql.addListener(t.onScreenOrientationChange);
		},
		/**
		 * @function adModule.removeAllElements
		 */
		removeAllElements: function () {
			if (content) content.parentNode.removeChild(content);
		},
		/**
		 * @function adModule.redirectToAdSite
		 */
		redirectToAdSite: function () {
			window.location.href = baseData.ads[0].click_url;
		},
		/**
		 * @function adModule.initListeners
		 */
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
		/**
		 * @function adModule.sendGetRequest
		 * @param url
		 * @param callback
		 */
		sendGetRequest: function (url, callback) {
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function () {
				if (xhr.readyState !== 4 || xhr.status !== 200) return;
				if (typeof callback == 'function') callback(xhr);
			};
			xhr.open("GET", url, true);
			xhr.send();
		},
		/**
		 * @function adModule.sendInitialRequest
		 */
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
		/**
		 * Start function for external use
		 * @function adModule.init
		 */
		init: function () {
			t = this;
			t.sendInitialRequest();
			t.initElements();
			t.initListeners();
		}
	}
};

if (typeof exports != 'undefined') exports.adModule = adModule;