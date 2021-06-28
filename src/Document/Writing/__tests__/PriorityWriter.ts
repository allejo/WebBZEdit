import { PriorityWriter } from '../PriorityWriter';

describe('PriorityWriter', () => {
  it('should write things in the correct order', () => {
    const writer = new PriorityWriter();
    writer.push(0, 'world');
    writer.push(-1, 'hello');
    writer.push(10, '?', '!');

    expect(writer.export()).toEqual(['hello', 'world', '?', '!']);
  });
});
