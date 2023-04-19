class Dom {
	constructor(selector) {
		this.elem = typeof selector === 'string' ? document.querySelector(selector) : selector;
	}

	html(html) {
		if (typeof html !== 'string') return this.elem.outerHTML.trim();
		this.elem.innerHTML = html;
		return this;
	}

	append(elem) {
		const node = elem instanceof Dom ? elem.elem : elem;
		this.elem.append(node);
		return this;
	}

	on(event, callback) {
		this.elem.addEventListener(event, callback);
		return this;
	}

	off(event, callback) {
		this.elem.removeEventListener(event, callback);
		return this;
	}

	addClass(className) {
		this.elem.classList.add(className);
		return this;
	}

	delClass(className) {
		this.elem.classList.remove(className);
		return this;
	}

	closest(selector) {
		return this.elem.closest(selector);
	}

	selectAll(selector) {
		return this.elem.querySelectorAll(selector);
	}

	select(selector) {
		return this.elem.querySelector(selector);
	}

	get children() {
		return this.elem.children;
	}

	get cHeight() {
		return this.elem.clientHeight;
	}

	get cWidth() {
		return this.elem.clientWidth;
	}

	get oHeight() {
		return this.elem.offsetHeight;
	}

	get oWidth() {
		return this.elem.offsetWidth;
	}

	get sHeight() {
		return this.elem.scrollHeight;
	}

	get sWidth() {
		return this.elem.scrollWidth;
	}

	get style() {
		return this.elem.style;
	}

	get scrollX() {
		return this.elem.scrollLeft;
	}

	get scrollY() {
		return this.elem.scrollTop;
	}

	get top() {
		return this.elem.getBoundingClientRect().top;
	}

	get bottom() {
		return this.elem.getBoundingClientRect().bottom;
	}

	get left() {
		return this.elem.getBoundingClientRect().left;
	}

	get right() {
		return this.elem.getBoundingClientRect().right;
	}
}

export default function $(selector) {
	return new Dom(selector);
}

$.create = (tagName, className = '') => {
	const elem = document.createElement(tagName);
	elem.className = className;
	return $(elem);
};
