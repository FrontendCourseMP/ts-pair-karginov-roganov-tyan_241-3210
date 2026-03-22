import { evaluateExpression } from "./expression.js";

const exprInput = document.querySelector<HTMLInputElement>("#expr");
const calculateBtn = document.querySelector<HTMLButtonElement>("#calculate");
const resultEl = document.querySelector<HTMLDivElement>("#result");

if (!exprInput || !calculateBtn || !resultEl) {
  throw new Error("Не найдены #expr, #calculate или #result");
}

const input = exprInput;
const btn = calculateBtn;
const out = resultEl;

function showResult(text: string, isError: boolean): void {
  out.textContent = text;
  out.classList.toggle("result--error", isError);
}

function runCalculation(): void {
  try {
    const value = evaluateExpression(input.value);
    showResult(String(value), false);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    showResult(msg, true);
  }
}

btn.addEventListener("click", runCalculation);

input.addEventListener("keydown", (ev: KeyboardEvent) => {
  if (ev.key === "Enter") {
    ev.preventDefault();
    runCalculation();
  }
});
