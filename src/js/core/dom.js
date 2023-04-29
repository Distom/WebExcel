class Dom {
	constructor(selector) {
		if (typeof selector === 'string') {
			const elem = document.querySelector(selector);

			if (!elem) return {};

			this.elem = elem;
		} else if ($.check(selector)) {
			return selector;
		} else {
			this.elem = selector;
		}
	}

	html(html) {
		if (typeof html !== 'string') return this.elem.innerHTML;
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

	after(elem) {
		const node = elem instanceof Dom ? elem.elem : elem;
		this.elem.after(node);
		return this;
	}

	before(elem) {
		const node = elem instanceof Dom ? elem.elem : elem;
		this.elem.before(node);
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

	css(styles) {
		if (styles) {
			if (typeof styles === 'string') {
				this.elem.style.cssText = styles;
			} else if (typeof styles === 'object') {
				Object.keys(styles).forEach(prop => (this.elem.style[prop] = styles[prop]));
			}
		}

		if (arguments.length === 0) {
			return this.elem.style.cssText;
		}

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

	insertHTML(...args) {
		this.elem.insertAdjacentHTML(...args);
		return this;
	}

	clone(...args) {
		return $(this.elem.cloneNode(...args));
	}

	replaceWith(...args) {
		return this.elem.replaceWith(...args);
	}

	get parentNode() {
		return $(this.elem.parentNode);
	}

	get parentElem() {
		return $(this.elem.parentElement);
	}

	get nodeValue() {
		return this.elem.nodeValue;
	}

	get childs() {
		return this.elem.childNodes;
	}

	get prev() {
		return this.elem.previousSibling;
	}

	get next() {
		return this.elem.nextSibling;
	}

	get prevElem() {
		return $(this.elem.previousElementSibling);
	}

	get nextElem() {
		return $(this.elem.nextElementSibling);
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

	get lChild() {
		return this.elem.lastChild;
	}

	get fElChild() {
		return $(this.elem.firstElementChild);
	}

	get lElChild() {
		return $(this.elem.lastElementChild);
	}

	get data() {
		return this.elem.dataset;
	}

	get tag() {
		return this.elem.tagName;
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
	if (className) elem.className = className;
	return $(elem);
};

$.check = elem => {
	return elem instanceof Dom;
};

$.createText = text => document.createTextNode(text);
