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
}

export default function $(selector) {
	return new Dom(selector);
}

$.create = (tagName, className = '') => {
	const elem = document.createElement(tagName);
	elem.className = className;
	return $(elem);
};
