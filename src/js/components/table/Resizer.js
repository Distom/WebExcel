import $ from '../../core/dom';
import { getScrollBarWidth } from '../../core/utils';

export default class Resizer {
	#resizer;

	resizerTop;

	resizerLeft;

	topCompensation;

	leftCompensation;

	constructor(table, minElemSize) {
		this.table = table;
		this.minElemSize = minElemSize;
		this.resizerWidth = $('.document-table__resizer_column').oWidth;
	}

	get resizer() {
		return this.#resizer;
	}

	set resizer(resizer) {
		if (this.#resizer) {
			this.#resizer.delClass('active');
		}

		if (resizer) {
			resizer.addClass('active');
		}

		this.#resizer = resizer;
	}

	get resizerType() {
		return this.#resizer?.elem.dataset.resize;
	}

	updateChordsRange() {
		const scrollbarWidth = getScrollBarWidth();

		this.X = {
			max: this.table.root.cWidth - scrollbarWidth - this.resizerWidth,
			min: this.listElem.left + this.minElemSize,
		};

		this.Y = {
			max: window.innerHeight - scrollbarWidth - this.resizerWidth,
			min: this.listElem.top + this.minElemSize,
		};
	}

	initResizer(event) {
		this.listElem = $(this.resizer.closest('li'));
		this.updateChordsRange();

		this.resizerTop = this.resizer.top;
		this.resizerLeft = this.resizer.left;

		this.topCompensation = event.clientY - this.resizerTop;
		this.leftCompensation = event.clientX - this.resizerLeft;

		this.setPositionFixed();
	}

	moveResizer(event) {
		if (this.resizerType === 'row') {
			let y = event.clientY - this.topCompensation;
			y = Math.max(this.Y.min, y);
			y = Math.min(this.Y.max, y);

			requestAnimationFrame(() => {
				if (!this.resizer) return;
				this.resizer.style.top = `${y}px`;
			});
		} else if (this.resizerType === 'col') {
			let x = event.clientX - this.leftCompensation;
			x = Math.max(this.X.min, x);
			x = Math.min(this.X.max, x);

			requestAnimationFrame(() => {
				if (!this.resizer) return;
				this.resizer.style.left = `${x}px`;
			});
		}
	}

	endResizer() {
		this.removePositionFixed();
		this.resizer = null;
		this.resizerTop = 0;
		this.resizerLeft = 0;
	}

	setPositionFixed() {
		this.resizer.style.top = `${this.resizerTop}px`;
		this.resizer.style.left = `${this.resizerLeft}px`;
		this.resizer.style.position = 'fixed';
	}

	removePositionFixed() {
		this.resizer.style.top = '';
		this.resizer.style.left = '';
		this.resizer.style.position = '';
	}

	onPointerdown(event) {
		const resizer = event.target.closest('[data-resize]');
		if (!resizer) return;

		this.resizer = $(resizer);
		event.target.setPointerCapture(event.pointerId);
		this.initResizer(event);
	}

	onPointermove(event) {
		if (!this.resizer) return;
		this.moveResizer(event);
	}

	onPointerup() {
		if (!this.resizer) return;

		if (this.resizerType === 'row') {
			const newHeight = this.resizer.bottom - this.listElem.top - Math.ceil(this.resizerWidth / 2);

			this.updateRowHeight(this.getIndex(), newHeight);
		} else if (this.resizerType === 'col') {
			const newWidth = this.resizer.right - this.listElem.left - Math.ceil(this.resizerWidth / 2);

			this.updateColumnWidth(this.getIndex(), newWidth);
		}

		this.endResizer();
	}

	getIndex() {
		let index;

		if (this.resizerType === 'row') {
			index = Array.from(this.table.info.children).indexOf(this.listElem.elem);
		} else if (this.resizerType === 'col') {
			index = Array.from(this.table.header.children).indexOf(this.listElem.elem);
		}

		return index;
	}

	updateColumnWidth(index, width) {
		this.table.header.children[index].style.width = `${width}px`;
		Array.from(this.table.rows.children)
			.map(row => row.firstElementChild.children[index])
			.forEach(cell => (cell.style.width = `${width}px`));
	}

	updateRowHeight(index, height) {
		this.table.info.children[index].style.height = `${height}px`;
		this.table.rows.children[index].style.height = `${height}px`;
	}
}
