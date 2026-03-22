import { assertExpressionCharacters } from "./validator.js";
import { Stack } from "../stack.js";
function isWhitespace(c) {
    return c === " " || c === "\t" || c === "\n" || c === "\r";
}
function skipSpaces(input, pos) {
    while (pos.i < input.length && isWhitespace(input[pos.i])) {
        pos.i++;
    }
}
function tryConsumeNumberChar(input, pos, sawDot) {
    if (pos.i >= input.length) {
        return false;
    }
    const c = input[pos.i];
    if (c >= "0" && c <= "9") {
        pos.i++;
        return true;
    }
    if (c === "." && !sawDot.value) {
        sawDot.value = true;
        pos.i++;
        return true;
    }
    return false;
}
function parseNumber(input, pos) {
    skipSpaces(input, pos);
    const start = pos.i;
    if (start >= input.length) {
        throw new Error("Ожидалось число, строка закончилась");
    }
    const sawDot = { value: false };
    while (pos.i < input.length && tryConsumeNumberChar(input, pos, sawDot)) { }
    if (pos.i === start) {
        throw new Error(`Ожидалось число на позиции ${start + 1}`);
    }
    const raw = input.slice(start, pos.i);
    const n = Number(raw);
    if (!Number.isFinite(n)) {
        throw new Error(`Некорректное число: ${raw}`);
    }
    return n;
}
function tokenize(input) {
    const tokens = [];
    const pos = { i: 0 };
    while (true) {
        skipSpaces(input, pos);
        if (pos.i >= input.length) {
            break;
        }
        const c = input[pos.i];
        if (c === "+" || c === "*") {
            tokens.push({ kind: "op", value: c });
            pos.i++;
        }
        else if (c >= "0" && c <= "9" || c === ".") {
            tokens.push({ kind: "num", value: parseNumber(input, pos) });
        }
        else {
            throw new Error(`Неожиданный символ на позиции ${pos.i + 1}`);
        }
    }
    return tokens;
}
function validateTokens(tokens) {
    if (tokens.length === 0) {
        throw new Error("Пустое выражение");
    }
    if (tokens.length % 2 === 0) {
        throw new Error("Выражение должно заканчиваться числом");
    }
    for (let i = 0; i < tokens.length; i++) {
        const wantNumber = i % 2 === 0;
        const t = tokens[i];
        if (wantNumber) {
            if (t.kind !== "num") {
                throw new Error("Ожидалось число");
            }
        }
        else if (t.kind !== "op") {
            throw new Error("Ожидалось + или *");
        }
    }
}
function opPrecedence(op) {
    return op === "*" ? 2 : 1;
}
function toRpn(tokens) {
    const out = [];
    const ops = new Stack();
    for (const t of tokens) {
        if (t.kind === "num") {
            out.push(t);
            continue;
        }
        const o1 = t.value;
        while (!ops.isEmpty() && opPrecedence(ops.peek()) >= opPrecedence(o1)) {
            out.push({ kind: "op", value: ops.pop() });
        }
        ops.push(o1);
    }
    while (!ops.isEmpty()) {
        out.push({ kind: "op", value: ops.pop() });
    }
    return out;
}
function evalRpn(rpn) {
    const st = new Stack();
    for (const t of rpn) {
        if (t.kind === "num") {
            st.push(t.value);
            continue;
        }
        const b = st.pop();
        const a = st.pop();
        if (t.value === "+") {
            st.push(a + b);
        }
        else {
            st.push(a * b);
        }
    }
    if (st.isEmpty()) {
        throw new Error("Пустой результат");
    }
    const result = st.pop();
    if (!st.isEmpty()) {
        throw new Error("Некорректное выражение");
    }
    return result;
}
export function evaluateExpression(input) {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
        throw new Error("Пустая строка");
    }
    assertExpressionCharacters(trimmed);
    const tokens = tokenize(trimmed);
    validateTokens(tokens);
    const rpn = toRpn(tokens);
    return evalRpn(rpn);
}
//# sourceMappingURL=calculator.js.map