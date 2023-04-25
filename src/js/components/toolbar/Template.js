import { bindAll } from '../../core/utils';
import initialState from './initialState';

export default class Template {
	constructor(toolbar) {
		this.toolbar = toolbar;
		bindAll(this);
	}

	getButton(button) {
		const activeClass = button.active ? 'active' : '';

		const buttonHTML = `
		<li class="toolbar-buttons-block__button-wrapper">
			<button class="toolbar-buttons-block__button button ${activeClass}" data-type="button" data-value='${JSON.stringify(
			button.value,
		)}'>
				<i class="toolbar-buttons-block__button-icon material-icons">${button.icon}</i>
			</button>
		</li>`;

		return buttonHTML;
	}

	getButtonsBlock(buttons) {
		let buttonsBlock =
			'<li class="document-toolbar__buttons-block toolbar-buttons-block"><ul class="toolbar-buttons-block__buttons">';

		buttonsBlock += buttons.map(this.getButton).join('');

		return `${buttonsBlock}</ul></li>`;
	}

	createToolbar() {
		this.buttons = this.getButtons();

		let toolbar = '<ul class="document-toolbar__container">';
		toolbar += Object.values(this.buttons).map(this.getButtonsBlock).join('');

		return `${toolbar}</ul>`;
	}

	getButtons() {
		const { state } = this.toolbar;

		return {
			textStyle: [
				{
					icon: 'format_bold',
					active: state.fontWeight === 'bold',
					value: { fontWeight: state.fontWeight === 'bold' ? initialState.fontWeight : 'bold' },
				},
				{
					icon: 'format_italic',
					active: state.fontStyle === 'italic',
					value: { fontStyle: state.fontStyle === 'italic' ? initialState.fontStyle : 'italic' },
				},
				{
					icon: 'format_underlined',
					active: state.textDecoration === 'underline',
					value: {
						textDecoration:
							state.textDecoration === 'underline' ? initialState.textDecoration : 'underline',
					},
				},
			],

			textAlign: [
				{
					icon: 'format_align_left',
					active: state.textAlign === 'left',
					value: { textAlign: 'left' },
				},
				{
					icon: 'format_align_center',
					active: state.textAlign === 'center',
					value: { textAlign: 'center' },
				},
				{
					icon: 'format_align_right',
					active: state.textAlign === 'right',
					value: { textAlign: 'right' },
				},
			],
		};
	}
}
