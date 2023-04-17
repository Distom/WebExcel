import ExcelComponent from '../../core/ExcelComponent';

export default class Formula extends ExcelComponent {
	static className = 'main-document__formula document-formula';

	static tagName = 'section';

	constructor(root) {
		super(root, {
			name: 'Formula',
		});
	}

	toHTML() {
		return `
		<div class="document-formula__info">fx</div>
		<div class="document-formula__input" contenteditable="true" spellcheck="false"></div>`;
	}
}
