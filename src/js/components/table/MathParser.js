import Mexp from 'math-expression-evaluator';
import { converToNumberChord } from '../../core/utils';

export default class MathParser {
	constructor(table) {
		this.table = table;
	}

	parse(expression) {
		if (!expression?.startsWith('=')) return expression;

		const mathExpression = this.replaceCellIds(expression.slice(1));

		const mexp = new Mexp();
		try {
			return mexp.eval(mathExpression).toString();
		} catch {
			return '=Error!';
		}
	}

	replaceCellIds(str) {
		const state = this.table.store.getState();
		return str.replace(/[A-Z]\d+/g, match => {
			const cellId = converToNumberChord(match);
			return this.parse(state.cellsState[cellId]?.data);
		});
	}
}
