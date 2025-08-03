export function normalizeArabicDigits(input: string) {
  return input.replace(/[\u0660-\u0669]/g, (digit) =>
    String.fromCharCode(digit.charCodeAt(0) - 0x0660 + 0x30)
  );
}

export function isSafeInput(input: string) {
  const blacklist = [
    /<script.*?>.*?<\/script>/i,
    /\b(SELECT|INSERT|DELETE|UPDATE|DROP)\b/i,
    /\bOR\b.+\b=\b/i,
  ];

  return !blacklist.some((pattern) => pattern.test(input));
}

export function cleanInputInvisibleChars(input: string) {
  return input.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g, "");
}
