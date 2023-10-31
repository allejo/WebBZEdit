export class Stack<T> {
	constructor(private readonly elements: T[] = []) {}

	peek(idx = 0): T | null {
		return this.elements[this.length - 1 - idx] ?? null;
	}

	push(...element: T[]): void {
		this.elements.push(...element);
	}

	pop(): T | undefined {
		return this.elements.pop();
	}

	get length(): number {
		return this.elements.length;
	}
}
