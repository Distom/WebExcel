import ExcelComponent from '../../core/ExcelComponent';
import { bindAll, getLetterChord } from '../../core/utils';

export default class Formula extends ExcelComponent {
	static className = 'main-document__formula document-formula';

	static tagName = 'section';

	constructor(root, options = {}) {
		super(root, {
			name: 'Formula',
			listeners: ['input', 'keydown'],
			...options,
		});
	}

	get focused() {
		return !!window.document.activeElement.closest('[data-formula="input"]');
	}

	init() {
		super.init();
		this.initHTMLElements();
		bindAll(this);

		this.on('cell:input', value => {
			if (!this.focused) this.setInputText(value);
		});
		this.on('cell:changed', ({ newCell }) => this.setInputText(newCell.data.content));
		this.on('table:select', this.updateChords);
	}

	initHTMLElements() {
		this.startChord = this.root.select('[data-formula="startChord"]');
		this.endChord = this.root.select('[data-formula="endChord"]');
		this.chordsDouble = this.root.select('[data-formula="chordsDouble"]');
		this.input = this.root.select('[data-formula="input"]');
	}

	setInputText(text) {
		this.input.html(text);
	}

	updateChords({ start, end }) {
		this.startChord.text(getLetterChord(start));
		this.endChord.text(getLetterChord(end));

		if (start.elem === end.elem) {
			this.endChord.elem.hidden = true;
			this.chordsDouble.elem.hidden = true;
		} else {
			this.endChord.elem.hidden = false;
			this.chordsDouble.elem.hidden = false;
		}
	}

	toHTML() {
		return `
		<div class="document-formula__chords">
			<span class="document-formula__chords-start" data-formula="startChord"></span><span class="document-formula__chords-double" data-formula="chordsDouble">:</span><span class="document-formula__chords-end" data-formula="endChord"></span>
		</div>
		<div class="document-formula__fx">fx</div>
		<div class="document-formula__input" contenteditable="true" spellcheck="false" data-formula="input"></div>`;
	}

	onInput() {
		this.emit('formula:input', this.input.text());
	}

	onKeydown(event) {
		switch (event.code) {
			case 'Enter':
			case 'Tab':
				event.preventDefault();
				this.emit('formula:focus-cell');
				break;

			// no default
		}
	}
}
