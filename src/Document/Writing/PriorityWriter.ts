export class PriorityWriter {
	private content: Record<number, string[]> = {
		0: [],
	};

	public push(priority: number, ...lines: string[]): void {
		if (this.content[priority] === undefined) {
			this.content[priority] = [];
		}

		this.content[priority].push(...lines);
	}

	public export(): string[] {
		return Object.keys(this.content)
			.sort((a, b) => +a - +b)
			.map((index: string) => {
				return [...this.content[+index]];
			})
			.flat(2);
	}
}
