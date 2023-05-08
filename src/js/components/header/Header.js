import ExcelComponent from '../../core/ExcelComponent';
import Storage from '../../core/Storage';
import $ from '../../core/dom';
import Router from '../../core/routes/Router';
import { defuseHTML } from '../../core/utils';
import { changeTitle } from '../../store/actions';

export default class Header extends ExcelComponent {
	static className = 'document__header header-document';

	static tagName = 'header';

	constructor(root, options = {}) {
		super(root, {
			name: 'Header',
			listeners: ['input', 'keydown', 'click'],
			...options,
		});
	}

	init() {
		super.init();

		this.title = this.root.select('[data-type="title"]');
	}

	onClick(event) {
		const button = $(event.target.closest('[data-button]'));
		if (!button) return;

		const router = new Router();

		switch (button.data.button) {
			case 'delete': {
				const confirmed = window.confirm(`Delete "${this.store.getState().title}" table?`);

				if (confirmed) {
					Storage.removeDocument(router.currentHash);
					router.route('/');
				}

				break;
			}

			case 'exit':
				router.route('/');
				break;

			// no default
		}
	}

	onInput(event) {
		const target = $(event.target);
		if (target.closest('[data-type="title"]')) {
			this.dispatch(changeTitle(this.title.text()));
		}
	}

	onKeydown(event) {
		const { code } = event;
		if (code === 'Enter' || code === 'Escape') {
			event.target.blur();
		}
	}

	toHTML() {
		const { title } = this.store.getState();
		return `
		<div class="header-document__container">
			<div class="header-document__input" contenteditable="true" spellcheck="false" data-type="title">${defuseHTML(
				title,
			)}</div>
			<div class="header-document__buttons">
				<button class="header-document__button button" data-button="delete">
					<i class="header-document__button-icon material-icons">delete</i>
				</button>
				<button class="header-document__button button" data-button="exit">
					<i class="header-document__button-icon material-icons">exit_to_app</i>
				</button>
			</div>
		</div>`;
	}
}
