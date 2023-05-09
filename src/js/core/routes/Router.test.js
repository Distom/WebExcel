/* eslint-disable max-classes-per-file */
import Page from '../Page';
import $ from '../dom';
import Router from './Router';

const excelPageContent = 'excel content';
const dashboardPageContent = '<a href="/excel">Route button</a>';

class DashboardPage extends Page {
	getRoot() {
		return $.create('div').html(dashboardPageContent);
	}
}

class ExcelPage extends Page {
	getRoot() {
		return $.create('div').html(excelPageContent);
	}
}

describe('Router', () => {
	const root = $.create('div');
	const router = new Router(root, {
		'/': DashboardPage,
		'/excel': ExcelPage,
	});

	it('is defined', () => {
		expect(router).toBeDefined();
		expect(router.currentHash).toBeDefined();
		expect(router.currentPath).toBeDefined();
		expect(router.route).toBeDefined();
		expect(router.destroy).toBeDefined();
	});

	it('get correct currentHash', () => {
		const hash = window.location.hash;
		window.location.hash = 'test';
		expect(router.currentHash).toBe('test');
		window.location.hash = hash;
	});

	it('get correct currentPath', () => {
		const path = window.location.pathname;
		window.history.pushState({}, '', '/test');
		expect(router.currentPath).toBe('/test');
		window.history.pushState({}, '', path);
	});

	it('route to default page after init', () => {
		expect(root.html()).toBe(`<div>${dashboardPageContent}</div>`);
	});

	it('route pages by route method ', () => {
		router.route('/excel');
		expect(root.html()).toBe(`<div>${excelPageContent}</div>`);
		router.route('/');
		expect(root.html()).toBe(`<div>${dashboardPageContent}</div>`);
	});

	it('route pages on click', async () => {
		const toExcelButton = root.select('a');
		toExcelButton.elem.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
		expect(root.html()).toBe(`<div>${excelPageContent}</div>`);
	});
});
