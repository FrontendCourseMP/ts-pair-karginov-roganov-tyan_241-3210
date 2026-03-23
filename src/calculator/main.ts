import { evaluate, hasInvalidChars } from "./expression.js";

const form = document.getElementById("f");
const input = document.getElementById("expr") as HTMLInputElement | null;
const output = document.getElementById("output") as HTMLOutputElement | null;

const errText =
  "Ошибка: можно вводить только цифры, точку, пробелы и знаки + и *";

function show(text: string, bad: boolean): void {
  if (!output) return;
  output.textContent = text;
  output.className = bad ? "err" : "";
}

if (input) {
  input.addEventListener("input", () => {
    if (input.value.length > 0 && hasInvalidChars(input.value)) show(errText, true);
    else show("", false);
  });
}

if (form && input && output) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (hasInvalidChars(input.value)) {
      show(errText, true);
      return;
    }
    try {
      const r = evaluate(input.value);
      show("Результат: " + r.value, false);
    } catch (e) {
      show(e instanceof Error ? e.message : String(e), true);
    }
  });
}
