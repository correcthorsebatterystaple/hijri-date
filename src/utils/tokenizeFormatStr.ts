type FormatToken =
  | { type: "year"; length: number }
  | { type: "month"; length: number }
  | { type: "day"; length: number }
  | { type: "literal"; value: string };

function isFormatChar(char: string): char is "y" | "m" | "d" {
  return char === "y" || char === "m" || char === "d";
}

export function tokenizeFormatStr(formatStr: string): FormatToken[] {
  const tokens: FormatToken[] = [];

  let i = 0;
  while (i < formatStr.length) {
    const char = formatStr[i];

    if (!isFormatChar(char)) {
      tokens.push({ type: "literal", value: char });
      i++;
      continue;
    }

    let j = i + 1;
    while (j < formatStr.length && formatStr[j] === char) j++;
    const length = j - i;

    const type = {
      y: "year",
      m: "month",
      d: "day",
    } as const;

    tokens.push({ type: type[char], length });

    i = j;
  }

  return tokens;
}
