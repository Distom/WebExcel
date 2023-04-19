function capitalize(string) {
	return string[0].toUpperCase() + string.slice(1);
}

function getScrollBarWidth() {
	const div = document.createElement('div');
	div.style.cssText = `
	height: 200px;
	width: 100px;
	position: fixed;
	top: 0;
	left: -150px;
	overflow: scroll;`;
	document.body.append(div);
	const scrollBarWidth = div.offsetWidth - div.clientWidth;
	div.remove();
	return scrollBarWidth;
}

function updateCssProperty(property, value) {
	document.documentElement.style.setProperty(property, value);
}

function updateCssPropertyScrollBarWidth() {
	updateCssProperty('--scrollbar-width', `${getScrollBarWidth()}px`);
}

function bindAll(obj) {
	const prototype = Object.getPrototypeOf(obj);
	Object.getOwnPropertyNames(prototype).forEach(key => {
		if (key === 'constructor') return;
		obj[key] = obj[key].bind(obj);
	});
}

export {
	capitalize,
	getScrollBarWidth,
	updateCssProperty,
	updateCssPropertyScrollBarWidth,
	bindAll,
};
