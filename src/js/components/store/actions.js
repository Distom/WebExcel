import { TABLE_RESIZE, TEXT_INPUT } from './types';

export function tableResize(index, value, type) {
	return {
		type: TABLE_RESIZE,
		data: {
			index,
			value,
			type,
		},
	};
}

export function textInput(id, text) {
	return {
		type: TEXT_INPUT,
		data: {
			id,
			text,
		},
	};
}
