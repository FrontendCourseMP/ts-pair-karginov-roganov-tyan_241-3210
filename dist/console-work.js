import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
const DISALLOWED = /[^0-9+*\s.]/;
/**
 * assertExpressionCharacters — «проверить символы выражения»
 * Отвечает за то, чтобы в строке не было посторонних символов (букв, минуса, скобок и т.д.).
 */
function assertExpressionCharacters(input) {
    if (DISALLOWED.test(input)) {
        throw new Error("Допустимы только цифры, пробелы, точка, + и *");
    }
}
function skipSpaces(input, pos) {
    while (pos.i < input.length) {
        const c = input[pos.i];
        if (c === " " || c === "\t" || c === "\n" || c === "\r") {
            pos.i++;
        }
        else {
            break;
        }
    }
}
function parseNumber(input, pos) {
    skipSpaces(input, pos);
    const start = pos.i;
    if (start >= input.length) {
        throw new Error("Ожидалось число, строка закончилась");
    }
    let sawDot = false;
    while (pos.i < input.length) {
        const c = input[pos.i];
        if (c >= "0" && c <= "9") {
            pos.i++;
        }
        else if (c === "." && !sawDot) {
            sawDot = true;
            pos.i++;
        }
        else {
            break;
        }
    }
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
function parseFactor(input, pos) {
    return parseNumber(input, pos);
}
function parseTerm(input, pos) {
    let value = parseFactor(input, pos);
    while (true) {
        skipSpaces(input, pos);
        if (pos.i >= input.length || input[pos.i] !== "*") {
            break;
        }
        pos.i++;
        const right = parseFactor(input, pos);
        value *= right;
    }
    return value;
}
function parseExpr(input, pos) {
    let value = parseTerm(input, pos);
    while (true) {
        skipSpaces(input, pos);
        if (pos.i >= input.length || input[pos.i] !== "+") {
            break;
        }
        pos.i++;
        const right = parseTerm(input, pos);
        value += right;
    }
    return value;
}
/** Приоритет * выше + */
function evaluateExpression(input) {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
        throw new Error("Пустая строка");
    }
    assertExpressionCharacters(trimmed);
    const pos = { i: 0 };
    const value = parseExpr(trimmed, pos);
    skipSpaces(trimmed, pos);
    if (pos.i !== trimmed.length) {
        throw new Error(`Лишние символы начиная с позиции ${pos.i + 1}`);
    }
    return value;
}
async function runInteractive() {
    const rl = readline.createInterface({ input, output });
    console.log("Калькулятор: только числа, + и * (приоритет * выше +).");
    console.log("Пустая строка, exit или quit — выход.\n");
    try {
        while (true) {
            const line = await rl.question("> ");
            const trimmed = line.trim();
            if (trimmed === "" ||
                /^exit$/i.test(trimmed) ||
                /^quit$/i.test(trimmed)) {
                break;
            }
            try {
                console.log(evaluateExpression(trimmed));
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                console.error("Ошибка:", msg);
            }
        }
    }
    finally {
        rl.close();
    }
}
const arg = process.argv[2];
if (arg !== undefined) {
    try {
        console.log(evaluateExpression(arg));
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error(msg);
        process.exitCode = 1;
    }
}
else {
    void runInteractive();
}
//# sourceMappingURL=console-work.js.map