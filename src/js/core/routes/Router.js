import $ from '../dom';
import { bindAll } from '../utils';

export default class Router {
	page = null;

	constructor(selector, routes = {}) {
		if (!selector) {
			throw new Error('Router selector is not provided');
		}

		this.container = $(selector);
		this.routes = routes;
		this.repositoryRegEx = /.+(?=\/)/;
		this.repository = window.location.pathname.match(this.repositoryRegEx) || '';

		bindAll(this);
		this.init();
	}

	get currentHash() {
		return window.location.hash.slice(1);
	}

	get currentPath() {
		let path = window.location.pathname;
		path = path.replace(this.repositoryRegEx, '');
		return path;
	}

	init() {
		if (document.readyState === 'loading') {
			window.addEventListener('load', this.onLoad);
		} else {
			this.onLoad();
		}

		window.addEventListener('popstate', this.handleLocation);
		document.addEventListener('click', this.route);
	}

	destroy() {
		window.removeEventListener('load', this.onLoad);
		window.removeEventListener('popstate', this.handleLocation);
		document.removeEventListener('click', this.route);
	}

	onLoad() {
		const originalRoute = localStorage.getItem('originalRoute');

		if (originalRoute) {
			window.history.pushState({}, '', originalRoute);
			localStorage.removeItem('originalRoute');
		}

		this.handleLocation();
	}

	route(event) {
		const link = event.target.closest('a');
		if (!link) return;

		event.preventDefault();
		window.history.pushState({}, '', `${this.repository}${link.getAttribute('href')}`);

		this.handleLocation();
	}

	handleLocation() {
		if (this.page) this.page.destroy();
		this.container.html('');

		let Page = this.routes[this.currentPath];
		if (!Page) {
			Page = this.routes['/'];
			window.history.pushState({}, '', '/');
		}

		this.page = new Page(this.currentHash);
		this.container.append(this.page.getRoot());
		this.page.afterRender();
	}
}
