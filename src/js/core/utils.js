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

export { capitalize, getScrollBarWidth };
