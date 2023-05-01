import Mexp from 'math-expression-evaluator';

export default function mathParser(expression) {
	if (expression?.startsWith('=')) {
		const mexp = new Mexp();
		try {
			return mexp.eval(expression.slice(1)).toString();
		} catch {
			return '=Error!';
		}
	}

	return expression;
}
