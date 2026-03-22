import { evaluateExpression } from "./calculator.js";
const exprInput = document.querySelector("#expr");
const calculateBtn = document.querySelector("#calculate");
const resultEl = document.querySelector("#result");
if (!exprInput || !calculateBtn || !resultEl) {
    throw new Error("Не найдены #expr, #calculate или #result");
}
const input = exprInput;
const btn = calculateBtn;
const out = resultEl;
function showResult(text, isError) {
    out.textContent = text;
    out.classList.toggle("result--error", isError);
}
function runCalculation() {
    try {
        const value = evaluateExpression(input.value);
        showResult(String(value), false);
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        showResult(msg, true);
    }
}
btn.addEventListener("click", runCalculation);
input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
        ev.preventDefault();
        runCalculation();
    }
});
//# sourceMappingURL=index.js.map