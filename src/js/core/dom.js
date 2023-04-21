class Dom {
	constructor(selector) {
		if (typeof selector === 'string') {
			const elem = document.querySelector(selector);

			if (!elem) return {};

			this.elem = elem;
		} else {
			this.elem = selector;
		}
	}

	html(html) {
		if (typeof html !== 'string') return this.elem.outerHTML.trim();
		this.elem.innerHTML = html;
		return this;
	}

	text(textContent) {
		if (typeof textContent !== 'string') return this.elem.textContent;
		this.elem.textContent = textContent;
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
		if (!this.hasClass(className)) {
			this.elem.classList.add(className);
		}
		return this;
	}

	delClass(className) {
		if (this.hasClass(className)) {
			this.elem.classList.remove(className);
		}
		return this;
	}

	hasClass(className) {
		return this.elem.classList.contains(className);
	}

	closest(selector) {
		return $(this.elem.closest(selector));
	}

	selectAll(selector) {
		return this.elem.querySelectorAll(selector);
	}

	select(selector) {
		return $(this.elem.querySelector(selector));
	}

	css(styles = {}) {
		Object.keys(styles).forEach(prop => (this.elem.style[prop] = styles[prop]));
		return this;
	}

	remove() {
		this.elem.remove();
		return this;
	}

	focus() {
		this.elem.focus();
		return this;
	}

	blur() {
		this.elem.blur();
		return this;
	}

	scrollTo(...args) {
		this.elem.scrollTo(...args);
		return this;
	}

	scrollBy(...args) {
		this.elem.scrollBy(...args);
		return this;
	}

	set hidden(value) {
		this.elem.hidden = value;
	}

	get hidden() {
		return this.elem.hidden;
	}

	set tabIndex(value) {
		this.elem.tabIndex = value;
	}

	get fChild() {
		return this.elem.firstChild;
	}

	get data() {
		return this.elem.dataset;
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
	if (selector === null || selector === undefined) return undefined;

	const obj = new Dom(selector);

	if (Object.keys(obj).length === 0) {
		return undefined;
	}

	return obj;
}

$.create = (tagName, className = '') => {
	const elem = document.createElement(tagName);
	elem.className = className;
	return $(elem);
};
