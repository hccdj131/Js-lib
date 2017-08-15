import {
	hasPerspective,
	hasTouch,
	hasTransform,
	hasTransition,
	getRect,
	eventType,
	style,
	offset,
	addEvent,
	removeEvent,
	prepend,
	preventDefaultException,
	tap,
	click
} from '../util/dom';
// import dom 操作

import {extend, requestAnimationFrame, cancelAnimationFrame} from '../util/lang';
import {isBadAndroid} from '../util/env';
import {ease} from '../util/ease';
import {EventEmitter} from '../util/EventEmitter';
import {momentum} from '../util/momentum';

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole';

const TOUCH_EVENT = 1;

export class BScroll extends EventEmitter {
	constructor(el, options) {
		super();
		this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
		this.scroller = this.wrapper.children[0];
		// cache style for better performance
		this.scrollerStyle = this.scroller.style;

		this.options = {
			startX: 0,
			startY: 0,
			scrollY: true,
			directionLockThreshold: 5,
			momentum: true,
			bounce: true,
			selectedIndex: 0,
			rotate: 25,
			wheel: false,
			snap: false,
			snapLoop: false,
			snapThreshold: 0.1,
			swipeTime: 2500,
			bounceTime: 700,
			adjustTime: 400,
			swipeBounceTime: 1200,
			deceleration: 0.001,
			momentumLimiTime: 300,
			momentumLimitDistance: 15,
			flickLimitTime: 200,
			flickLimitDistance: 100,
			resizePolling: 60,
			preventDefault: true,
			preventDefaultException: {
				tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
			},
			HWCompositing: true,
			// 混合
			useTransition: true,
			useTransform: true,
			autoScroll: false
		};

		extend(this.options, options);

		this.translateZ = this.options.HWCompositing && hasPerspective ? ' translateZ(0)' : '';

		this.options.useTransition = this.options.useTransition && hasTransition;
		this.options.useTransform = this.options.useTransform && hasTransform;

		this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
		this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

		// If you want eventPassthrough I have to lock one of the axes
		this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;
		this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;

		// With eventPassthrough we also need lockDirection mechanism
		this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
		this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

		if (this.options.tap === true) {
			this.options.tap = 'tap';
		}

		this._init();

		if (this.options.snap) {
			this._initSnap();
		}

		if (this.options.autoScroll) {
			this._initAutoScroll();
		}

		this.refresh();

		if (!this.options.snap) {
			this.scrollTo(this.options.startX, this.options.startY);
		}

		this.enable();
	}

	_init() {
		this.x = 0;
		this.y = 0;
		this.directionX = 0;
		this.directionY = 0;

		this._addEvents();
	}

	_initSnap() {
		this.currentPage = {};

		if (this.options.snapLoop) {
			let children = this.scroller.children;
			if (children.length > 0) {
				prepend(children[children.length - 1].cloneNode(true), this.scroller);
				// prepend()方法将制定元素插入到匹配元素里面作为它的第一个子元素
				// cloneNode()方法可创建指定的节点的精确拷贝
				this.scroller.appendChild(children[1].cloneNode(true));
			}
		}

		if (typeof this.options.snap === 'string') {
			this.options.snap = this.scroller.querySelector(this.options.snap);
		}

		this.on('refresh', () => {
			this.pages = [];

			if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWdith || !this.scrollerHeight) {
				return;
			}

			let stepX = this.options.snapStepX || this.wrapperWidth;
			let stepY = this.options.snapStepY || this.wrapperHeight;

			let x = 0;
			let y;
			let cx;
			let cy;
			let i = 0;
			let l;
			let m = 0;
			let n;
			let el;
			let rect;
			if (this.options.snap === true) {
				cx = Math.round(stepX / 2);
				cy = Math.round(stepY / 2);

				while (x > -this.scrollerWdith) {
					this.pages[i] = [];
					l = 0;
					y = 0;

					while (y > -this.scrollerHeight) {
						this.pages[i][l] = {
							x: Math.max(x, this.maxScrollX),
							y: Math.max(y, this.maxScrollY),
							width: stepX,
							height: stepY,
							cx: x - cx,
							cy: y - cy
						};

						y -= stepY;
						l++;
					}

					x -= stepX;
					i++;
				}
			} else {
				el = this.options.snap;
				l = el.length;
				n = -1;

				for (; i < l; i++) {
					rect = getRect(el[i]);
					if (i === 0 || rect.left <= getRect(el[i - 1]).left) {
						m = 0;
						n++;
					}

					if (!this.pages[m]) {
						this.pages[m] = [];
					}

					x = Math.max(-rect.left, this.maxScrollX);
					y = Math.max(-rect.top, this.maxScrollY);
					cx = x - Math.round(rect.width / 2);
					cx = y - Math.round(rect.height / 2);

					this.pages[m][n] = {
						x: x,
						y: y,
						width: rect.width,
						height: rect.height,
						cx: cx,
						cy: cy
					};

					if (x > this.maxScrollX) {
						m++;
					}
				}
			}

			let initPage = this.options.snapLoop ? 1 : 0;
			this.goToPage(this.currentPage.pageX || initPage, this.currentPage.pageY || 0, 0);

			// Update snap threshold if needed
			if (this.options.snapThreshold % 1 === 0) {
				this.snapThresholdX = this.options.snapThreshold;
				this.snapThresholdY = this.options.snapThreshold;
			} else {
				this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
				this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
			}
		});

		this.on('scrollEnd', () => {
			if (this.options.snapLoop) {
				if (this.currentPage.pageX === 0) {
					this.goToPage(this.pages.length - 2, this.currentPage.pageY, 0);
				}
				if (this.currentPage.pageX === this.pages.length - 1) {
					this.goToPage(1, this.currentPage.pageY, 0);
				}
			}
		});
	}


}