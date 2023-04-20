import $ from '../../core/dom';
import { getScrollBarWidth } from '../../core/utils';

export default class Resizer {
	static activeClass = 'active';

	static instance;

	#resizer;

	resizerTop;

	resizerLeft;

	topCompensation;

	leftCompensation;

	constructor(table, minElemSize) {
		if (Resizer.instance) return Resizer.instance;

		this.table = table;
		this.minElemSize = minElemSize;
		this.resizerWidth = $('[data-resizer="col"]').oWidth;

		Resizer.instance = this;
	}

	get resizer() {
		return this.#resizer;
	}

	set resizer(resizer) {
		if (this.#resizer) {
			this.#resizer.delClass(Resizer.activeClass);
		}

		if (resizer) {
			resizer.addClass(Resizer.activeClass);
		}

		this.#resizer = resizer;
	}

	get resizerType() {
		return this.#resizer?.data.resizer;
	}

	onPointerdown(event) {
		this.resizer = $(event.target).closest('[data-resizer]');
		if (!this.resizer) return;

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
			const newHeight = this.resizer.bottom - this.resizable.top - Math.ceil(this.resizerWidth / 2);

			this.updateRowHeight(this.getIndex(), newHeight);
		} else if (this.resizerType === 'col') {
			const newWidth = this.resizer.right - this.resizable.left - Math.ceil(this.resizerWidth / 2);

			this.updateColumnWidth(this.getIndex(), newWidth);
		}

		this.endResizer();
	}

	updateChordsRange() {
		const scrollbarWidth = getScrollBarWidth();

		this.X = {
			max: this.table.root.cWidth - scrollbarWidth - this.resizerWidth,
			min: this.resizable.left + this.minElemSize,
		};

		this.Y = {
			max: window.innerHeight - scrollbarWidth - this.resizerWidth,
			min: this.resizable.top + this.minElemSize,
		};
	}

	initResizer(event) {
		this.resizable = this.resizer.closest('[data-resizable]');
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
				this.resizer.css({ top: `${y}px` });
			});
		} else if (this.resizerType === 'col') {
			let x = event.clientX - this.leftCompensation;
			x = Math.max(this.X.min, x);
			x = Math.min(this.X.max, x);

			requestAnimationFrame(() => {
				if (!this.resizer) return;
				this.resizer.css({ left: `${x}px` });
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
		this.resizer.css({
			top: `${this.resizerTop}px`,
			left: `${this.resizerLeft}px`,
			position: 'fixed',
		});
	}

	removePositionFixed() {
		this.resizer.css({
			top: '',
			left: '',
			position: '',
		});
	}

	getIndex() {
		let index;

		if (this.resizerType === 'row') {
			index = Array.from(this.table.indexesList.children).indexOf(this.resizable.elem);
		} else if (this.resizerType === 'col') {
			index = Array.from(this.table.headersList.children).indexOf(this.resizable.elem);
		}

		return index;
	}

	updateColumnWidth(index, width) {
		const header = $(this.table.headersList.children[index]);
		header.css({ width: `${width}px` });

		Array.from(this.table.rowsList.children)
			.map(row => $(row).select('[data-table-role="cells-list"]').children[index])
			.forEach(cell => $(cell).css({ width: `${width}px` }));
	}

	updateRowHeight(index, height) {
		const info = $(this.table.indexesList.children[index]);
		const row = $(this.table.rowsList.children[index]);

		info.css({ height: `${height}px` });
		row.css({ height: `${height}px` });
	}
}
