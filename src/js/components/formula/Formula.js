import ExcelComponent from '../../core/ExcelComponent';
import { bindAll, getFormatChord } from '../../core/utils';

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

	init() {
		super.init();
		this.initHTMLElements();
		bindAll(this);

		this.on('cell:input', this.setInputText);
		this.on('cell:changed', this.setInputText);
		this.on('table:select', this.updateChords);
	}

	initHTMLElements() {
		this.startChord = this.root.select('[data-formula="startChord"]');
		this.endChord = this.root.select('[data-formula="endChord"]');
		this.chordsDouble = this.root.select('[data-formula="chordsDouble"]');
		this.input = this.root.select('[data-formula="input"]');
	}

	setInputText(text) {
		this.input.text(text);
	}

	updateChords({ start, end }) {
		let startChordText = this.startChord.text();
		let endChordText = this.startChord.text();

		if (start) {
			startChordText = getFormatChord(start);
			this.startChord.text(startChordText);
		}

		if (end) {
			endChordText = getFormatChord(end);
			this.endChord.text(endChordText);
		}

		if (startChordText === endChordText) {
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
