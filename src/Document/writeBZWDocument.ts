import { IBaseObject } from './Obstacles/BaseObject';
import { IWorld } from './Obstacles/World';
import { writeArray, writeNumber } from './Writing/attributeWriters';
import {
	AttributePriority,
	AttributeWriters,
	FooterWriters,
	HeaderWriters,
	IgnoredAttributes,
} from './Writing/obstacleWriters';
import { PriorityWriter } from './Writing/PriorityWriter';

export interface StyleOptions {
	indentation: 'space' | 'tab';
	indentationWidth?: number;
}

let styleOptions: StyleOptions = {
	indentation: 'tab',
};

function getIndentation(): string {
	if (styleOptions.indentation === 'tab') {
		return '\t';
	}

	return ' '.repeat(styleOptions.indentationWidth ?? 4);
}

function writeObstacle(
	obstacle: IBaseObject,
	writeChildren: boolean,
): string[] {
	const obstacleType = obstacle._objectType;
	const terminator = obstacle._terminator;
	const rawBody = new PriorityWriter();

	Object.entries(obstacle).forEach(([attribute, value]) => {
		const isInternal = attribute[0] === '_';
		const isIgnored =
			IgnoredAttributes._global.indexOf(attribute) >= 0 ||
			IgnoredAttributes[obstacleType]?.indexOf(attribute) >= 0;

		if (isInternal || isIgnored) {
			return;
		}

		const writePriority: number =
			AttributePriority._global[attribute] ??
			AttributePriority?.[obstacleType]?.[attribute] ??
			0;
		const customAttributeWriter = AttributeWriters?.[obstacleType]?.[attribute];

		// If we need special handling of values, we use an Attribute Writer
		if (customAttributeWriter) {
			const customWriteResponse = customAttributeWriter(value);

			if (Array.isArray(customWriteResponse)) {
				rawBody.push(writePriority, ...customWriteResponse);
			} else {
				rawBody.push(writePriority, customWriteResponse);
			}
		}
		// An object has children, such as a mesh that has faces
		else if (attribute === 'children') {
			if (writeChildren) {
				Object.values(value as IBaseObject['children']).forEach(
					(child: IBaseObject) => {
						rawBody.push(writePriority, '', ...writeObstacle(child, true));
					},
				);
			}
		}
		// The attribute is a boolean flag
		else if (value === true) {
			rawBody.push(writePriority, attribute);
		}
		// The attribute value is numerical
		else if (typeof value === 'number') {
			const ignoreZeroValues = ['flagheight', 'rotation'];

			if (ignoreZeroValues.indexOf(attribute) >= 0 && value === 0) {
				return;
			}

			rawBody.push(writePriority, `${attribute} ${writeNumber(value)}`);
		}
		// A normal string attribute
		else if (typeof value === 'string') {
			if (value.trim().length === 0) {
				return;
			}

			rawBody.push(writePriority, `${attribute} ${value}`);
		}
		// The attribute can be two types of arrays. An array of primitive values or
		// an array of arrays.
		else if (Array.isArray(value)) {
			const isNested = value.every(Array.isArray);

			if (isNested) {
				for (const nestedElement of value) {
					rawBody.push(
						writePriority,
						`${attribute} ${writeArray(nestedElement).join(' ')}`,
					);
				}
			} else {
				const values = writeArray(value);

				rawBody.push(writePriority, `${attribute} ${values.join(' ')}`);
			}
		}
	});

	const obstacleBody = rawBody
		.export()
		.map((line) => (getIndentation() + line).trimRight());

	if (obstacleBody.length === 0) {
		return [];
	}

	return [
		HeaderWriters[obstacleType]?.(obstacle) ?? obstacleType,
		...obstacleBody,
		FooterWriters[obstacleType]?.(obstacle) ?? terminator,
	];
}

export function writeBZWDocument(
	document: IWorld,
	styling?: StyleOptions,
): string {
	if (styling) {
		styleOptions = styling;
	}

	const output = [
		// Print out the "world" object
		[writeObstacle(document, false), ''],

		// Print out the "options" object
		[writeObstacle(document._options, false), ''],

		// Print out all of the objects in this world
		Object.values(document.children).map((object: IBaseObject) => {
			return [writeObstacle(object, true), ''];
		}),
	];

	return output
		.flat(4) // Flatten out any nested lines into a single level
		.join('\n')
		.replace(/\n{3,}/, '\n\n') // Replace multiple empty lines with just one empty new line
		.replace(/(\r\n|\r|\n)/g, '\r\n')
		.trim();
}
