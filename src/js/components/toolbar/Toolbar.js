import ExcelComponent from '../../core/ExcelComponent';

export default class Toolbar extends ExcelComponent {
	static className = 'main-document__toolbar document-toolbar';

	static tagName = 'section';

	constructor(root) {
		super(root, {
			name: 'Toolbar',
		});
	}

	toHTML() {
		return `
		<ul class="document-toolbar__container">
					<li class="document-toolbar__buttons-block toolbar-buttons-block">
						<ul class="toolbar-buttons-block__buttons">
							<li class="toolbar-buttons-block__button-wrapper">
								<button class="toolbar-buttons-block__button button">
									<i class="toolbar-buttons-block__button-icon material-icons">format_bold</i>
								</button>
							</li>
							<li class="toolbar-buttons-block__button-wrapper">
								<button class="toolbar-buttons-block__button button">
									<i class="toolbar-buttons-block__button-icon material-icons">format_italic</i>
								</button>
							</li>
							<li class="toolbar-buttons-block__button-wrapper">
								<button class="toolbar-buttons-block__button button">
									<i class="toolbar-buttons-block__button-icon material-icons">format_underlined</i>
								</button>
							</li>
						</ul>
					</li>
					<li class="document-toolbar__buttons-block toolbar-buttons-block">
						<ul class="toolbar-buttons-block__buttons">
							<li class="toolbar-buttons-block__button-wrapper">
								<button class="toolbar-buttons-block__button button">
									<i class="toolbar-buttons-block__button-icon material-icons">format_align_left</i>
								</button>
							</li>
							<li class="toolbar-buttons-block__button-wrapper">
								<button class="toolbar-buttons-block__button button">
									<i class="toolbar-buttons-block__button-icon material-icons">format_align_center</i>
								</button>
							</li>
							<li class="toolbar-buttons-block__button-wrapper">
								<button class="toolbar-buttons-block__button button">
									<i class="toolbar-buttons-block__button-icon material-icons">format_align_right</i>
								</button>
							</li>
						</ul>
					</li>
				</ul>`;
	}
}
