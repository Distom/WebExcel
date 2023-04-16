import ExcelComponent from '../../core/ExcelComponent';

export default class Header extends ExcelComponent {
	static className = 'document__header header-document';

	static tagName = 'header';

	constructor(root) {
		super(root, {
			name: 'Header',
		});
	}

	toHTML() {
		return `
		<div class="header-document__container">
			<div class="header-document__input" contenteditable="true" spellcheck="false">Новая таблица</div>
			<div class="header-document__buttons">
				<button class="header-document__button button">
					<i class="header-document__button-icon material-icons">delete</i>
				</button>
				<button class="header-document__button button">
					<i class="header-document__button-icon material-icons">exit_to_app</i>
				</button>
			</div>
		</div>`;
	}
}
