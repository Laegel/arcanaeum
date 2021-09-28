export default class Queue<T> {
  public constructor(private items: T[]) {}

  public enqueue(item: T) {
    this.items.push(item);
  }

  public dequeue() {
    return this.items.shift();
  }

  public hasItems() {
    return this.items.length;
  }
}
