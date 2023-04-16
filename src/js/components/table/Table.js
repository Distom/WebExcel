import ExcelComponent from '../../core/ExcelComponent';
import createTableHTML from './table.template';

export default class Table extends ExcelComponent {
	static className = 'main-document__table document-table';

	static tagName = 'section';

	constructor(root) {
		super(root, {
			name: 'Table',
		});
	}

	toHTML() {
		return createTableHTML(1000);
	}
}
