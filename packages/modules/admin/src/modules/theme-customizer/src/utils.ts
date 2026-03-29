export const intToHex = (int: number): string => {
  const hex = Math.max(0, Math.min(255, Math.round(int))).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

export const decimalToHex = (decimal: number): string => {
  return intToHex(Math.round(decimal * 255));
};

export const toStandardHex = (input: string, fallback?: string): string => {
  let val = input.trim();
  if (!val.startsWith("#")) {
    val = `#${val}`;
  }

  const isValid = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/i.test(val);

  if (isValid) {
    // Convert 3-character hex to 6-character
    if (val.length === 4) {
      return `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`;
    }
    // Convert 4-character hex to 8-character
    if (val.length === 5) {
      return `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}${val[4]}${val[4]}`;
    }
    return val;
  }

  return fallback || "#000000";
};
