export function formText(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export function nullableText(formData: FormData, key: string) {
  return formText(formData, key) || null;
}

export function requiredText(formData: FormData, key: string, label: string) {
  const value = formText(formData, key);
  if (!value) throw new Error(`${label} is required.`);
  return value;
}

export function nonNegativeNumber(formData: FormData, key: string, fallback = 0) {
  const raw = Number(formData.get(key));
  return Number.isFinite(raw) && raw >= 0 ? raw : fallback;
}
