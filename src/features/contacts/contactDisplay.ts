import type { Contact } from "./contact.schema";

export type ContactGroup = { letter: string; contacts: Contact[] };

export function initialOf(name: string): string {
  const first = name.trim().normalize("NFD").charAt(0).toUpperCase();
  return /^[A-Z]$/.test(first) ? first : "#";
}

export const anchorOf = (letter: string) =>
  `letter-${letter === "#" ? "other" : letter}`;

export function groupContacts(contacts: Contact[]): ContactGroup[] {
  const sorted = [...contacts].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
  );
  const byLetter = new Map<string, Contact[]>();
  for (const contact of sorted) {
    const letter = initialOf(contact.name);
    byLetter.set(letter, [...(byLetter.get(letter) ?? []), contact]);
  }
  return [...byLetter]
    .map(([letter, items]) => ({ letter, contacts: items }))
    .sort((a, b) =>
      a.letter === "#" ? 1 : b.letter === "#" ? -1 : a.letter.localeCompare(b.letter),
    );
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = Array.from(parts[0])[0];
  const last = parts.length > 1 ? Array.from(parts[parts.length - 1])[0] : "";
  return (first + last).toUpperCase();
}

const TONES = [
  "bg-brand text-white",
  "bg-plum text-white",
  "bg-ocean text-white",
  "bg-leaf text-white",
  "bg-rose text-white",
];

export const toneFor = (id: number): string => TONES[Math.abs(id) % TONES.length];

