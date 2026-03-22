/** Универсальный стек (LIFO) для операторов при переводе в ОПЗ и для операндов при подсчёте. */
export declare class Stack<T> {
    private readonly items;
    push(value: T): void;
    pop(): T;
    peek(): T | undefined;
    isEmpty(): boolean;
}
//# sourceMappingURL=stack.d.ts.map