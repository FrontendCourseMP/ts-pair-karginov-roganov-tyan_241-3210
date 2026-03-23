import { Stack } from "./stack.js";

type Tok = { t: "n"; v: number } | { t: "op"; v: "+" | "*" };

export function hasInvalidChars(s: string): boolean {
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === undefined) continue;
    if (/\s/.test(c)) continue;
    if (/[0-9+.*]/.test(c)) continue;
    return true;
  }
  return false;
}

function tokenize(s: string): Tok[] {
  const a: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === undefined) break;
    if (ch === "+" || ch === "*") {
      a.push({ t: "op", v: ch });
      i++;
      continue;
    }
    if ((ch >= "0" && ch <= "9") || ch === ".") {
      const start = i;
      let dot = ch === ".";
      i++;
      while (i < s.length) {
        const c = s[i];
        if (c === undefined) break;
        if (c >= "0" && c <= "9") i++;
        else if (c === "." && !dot) {
          dot = true;
          i++;
        } else break;
      }
      const raw = s.slice(start, i);
      if (!/^\d*\.?\d+$/.test(raw) || raw === "." || raw.includes("..")) {
        throw new Error("Неправильное число");
      }
      const v = Number.parseFloat(raw);
      if (!Number.isFinite(v)) throw new Error("Неправильное число");
      a.push({ t: "n", v });
      continue;
    }
    throw new Error("Лишний символ");
  }
  return a;
}

function checkGrammar(a: Tok[]): void {
  if (a.length === 0) throw new Error("Пусто");
  for (let k = 0; k < a.length; k++) {
    const needNum = k % 2 === 0;
    if (needNum && a[k]!.t !== "n") throw new Error("Нужно число");
    if (!needNum && a[k]!.t !== "op") throw new Error("Нужен + или *");
  }
  if (a[a.length - 1]!.t === "op") throw new Error("Нельзя заканчивать на знак");
}

function prec(op: "+" | "*"): number {
  return op === "*" ? 2 : 1;
}

function toPostfix(a: Tok[]): Tok[] {
  const out: Tok[] = [];
  const ops = new Stack<{ t: "op"; v: "+" | "*" }>();
  for (const x of a) {
    if (x.t === "n") {
      out.push(x);
      continue;
    }
    while (!ops.isEmpty()) {
      const top = ops.peek();
      if (!top) break;
      if (prec(top.v) >= prec(x.v)) out.push(ops.pop()!);
      else break;
    }
    ops.push(x);
  }
  while (!ops.isEmpty()) {
    const o = ops.pop();
    if (o) out.push(o);
  }
  return out;
}

function evalPostfix(a: Tok[]): number {
  const st = new Stack<number>();
  for (const x of a) {
    if (x.t === "n") {
      st.push(x.v);
      continue;
    }
    const b = st.pop();
    const c = st.pop();
    if (b === undefined || c === undefined) throw new Error("Ошибка в выражении");
    st.push(x.v === "+" ? c + b : c * b);
  }
  if (st.size !== 1) throw new Error("Ошибка");
  const r = st.pop();
  if (r === undefined) throw new Error("Ошибка");
  return r;
}

export function evaluate(raw: string): { value: number; used: string } {
  if (hasInvalidChars(raw)) {
    throw new Error("Допустимы только цифры, точка, пробелы и знаки + и *");
  }
  const used = raw.trim().replace(/\s/g, "");
  if (used.length === 0) throw new Error("Введите выражение");
  const t = tokenize(used);
  checkGrammar(t);
  return { value: evalPostfix(toPostfix(t)), used };
}
