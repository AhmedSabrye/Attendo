
// this function is used to normalize the digits if someone wrote his numbers in arabic
export function normalizeDigits(input: string) {
  return input.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669) {
      return String(code - 0x0660); // Arabic-Indic
    }
    if (code >= 0x06f0 && code <= 0x06f9) {
      return String(code - 0x06f0); // Eastern Arabic-Indic
    }
    return char; // fallback, shouldn't happen
  });
}
