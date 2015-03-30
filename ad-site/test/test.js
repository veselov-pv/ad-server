var chai = require('chai'),
	expect = chai.expect,
	jsdom = require('mocha-jsdom'),
	adModule = require('../js/ad-module').adModule;


describe('ad module', function () {

	jsdom();

	describe('addClass()', function () {

		it('class name added', function () {
			var div = document.createElement('div');
			var newClassName = 'new-class-name';
			adModule.addClass(div, newClassName);

			expect(div.className).equal(newClassName);
		});

		it('class name added just once', function () {
			var div = document.createElement('div');
			var newClassName = 'new-class-name';
			adModule.addClass(div, newClassName);
			adModule.addClass(div, newClassName);

			expect(div.className).equal(newClassName);
		});

		it('class name added without clearing of other class name', function () {
			var div = document.createElement('div');
			var otherClassName = 'other-class-name';
			div.className = otherClassName;
			var newClassName = 'new-class-name';
			adModule.addClass(div, newClassName);
			adModule.addClass(div, newClassName);
			var classNameArray = div.className.split(' ');

			expect(classNameArray).to.include(otherClassName);
			expect(classNameArray).to.include(newClassName);
		});

	});

	describe('removeClass()', function () {

		it('class name removed', function () {
			var div = document.createElement('div');
			var className = 'class-name';
			div.className = className;
			adModule.removeClass(div, className);

			expect(div.className).to.be.empty;
		});

		it('class name removed if contains', function () {
			var div = document.createElement('div');
			var otherClassName = 'other-class-name';
			div.className = otherClassName;

			var className = 'class-name';
			adModule.removeClass(div, className);

			expect(div.className).equal(otherClassName);
		});

		it('class name removed without clearing of other class names', function () {
			var div = document.createElement('div');
			var otherClassName1 = 'new-class-name-1';
			var otherClassName2 = 'new-class-name-2';
			var className = 'class-name';
			div.className = otherClassName1 + ' ' + otherClassName2 + ' ' + className;
			adModule.removeClass(div, className);
			var classNameArray = div.className.split(' ');

			expect(classNameArray).to.include.members([otherClassName1, otherClassName2]);
			expect(classNameArray).to.not.include(className);
		});

	});

	describe('isJsonString()', function () {
		var object = {
			a: 1,
			string: "some string",
			obj: {key: 'value'},
			array: [1, 2, 'asdasd']
		};

		it('true if json', function () {
			var json = JSON.stringify(object);

			expect(adModule.isJsonString(json)).to.be.true;
		});

		it('false if not json', function () {
			var crashedJson = JSON.stringify(object).slice(-1);
			var emptyString = '';
			var justString = 'Hello World!';

			expect(adModule.isJsonString(crashedJson)).to.be.false;
			expect(adModule.isJsonString(emptyString)).to.be.false;
			expect(adModule.isJsonString(justString)).to.be.false;
		});

	});

	describe('deferredRun()', function () {

		it('run each time', function (done) {
			var neededTimes = 3;
			var delay = 30;
			var i = 0;
			adModule.deferredRun(function () {
				i += 1;
				if (i == neededTimes) done();
			}, delay, neededTimes);
		});

	});

	describe('getSummaryOffset()', function () {

		it('returned result has the keys "top" and "left"', function () {
			var div = document.createElement('div');
			expect(adModule.getSummaryOffset(div)).to.have.key('top', 'left');
		});

	});

	describe('checkImageDefiningSize()', function () {
	});

	describe('correctImageMirrorPosition()', function () {
	});

	describe('correctDownloadBtnWidthAndPosition()', function () {
	});

	describe('recheckElements()', function () {
	});

	it('onImageLoad()', function () {
	});

	it('getNewImage()', function () {
	});

	it('initElements()', function () {
	});

	it('onScreenOrientationChange()', function () {
	});

	it('initOrientationListener()', function () {
	});

	it('removeAllElements()', function () {
	});

	it('redirectToAdSite()', function () {
	});

	it('initListeners()', function () {
	});

	it('sendGetRequest()', function () {
	});

	it('sendInitialRequest()', function () {
	});

	it('init()', function () {
	});

});