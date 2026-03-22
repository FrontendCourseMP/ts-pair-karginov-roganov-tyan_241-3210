import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { evaluateExpression } from "./calculator/calculator.js";
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