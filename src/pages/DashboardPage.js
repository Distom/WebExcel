import Page from '../js/core/Page';
import $ from '../js/core/dom';
import { localStorageObj } from '../js/core/utils';

export default class DashboardPage extends Page {
	getDocumentsHTML() {
		let documentsHTML = '';

		for (let i = 0; i < localStorage.length; i += 1) {
			const key = localStorage.key(i);

			if (key.startsWith('excelDocument:')) {
				documentsHTML += this.getDocumentHTML(key);
			}
		}

		return documentsHTML;
	}

	getDocumentHTML(excelDocumentKey) {
		const id = excelDocumentKey.split(':')[1];
		const state = localStorageObj(excelDocumentKey);
		const date = new Date(+state.lastOpenedTimestamp);

		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const now = new Date();

		const locale = window.navigator.language || window.navigator.userLanguage;

		const dateStr =
			now.getDate() === day && now.getMonth() === month && now.getFullYear() === year
				? date.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric' })
				: date.toLocaleDateString(locale, { year: 'numeric', day: 'numeric', month: 'short' });

		return `
		<li class="home-documents-section__document">
			<a href="/excel#${id}" class="home-documents-section__document-link">
				<div class="home-documents-section__document-title">${state.title}</div>
				<time class="home-documents-section__document-date" datetime="${year}-${
			month + 1
		}-${day}">${dateStr}</time>
			</a>
		</li>`;
	}

	getRoot() {
		const id = Date.now().toString();
		const root = $.create('div', 'home').html(`
		<header class="home__header header-home">
			<div class="header-home__container">
				<h1 class="header-home__title">Excel Dashboard</h1>
			</div>
		</header>
		<main class="home__main main-home">
			<section class="main-home__buttons-section home-buttons-section">
				<div class="home-buttons-section__container">
					<a href="/excel#${id}" class="home-buttons-section__button">+</a>
				</div>
			</section>
			<section class="main-home__documents-section home-documents-section">
				<div class="home-documents-section__container">
					<header class="home-documents-section__header">
						<div class="home-documents-section__title">Title</div>
						<div class="home-documents-section__date">Last opened</div>
					</header>
					<ul class="home-documents-section__documents">
						${this.getDocumentsHTML()}
					</ul>
				</div>
			</section>
		</main>`);
		return root;
	}
}
