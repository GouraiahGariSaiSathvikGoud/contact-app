import { describe, expect, it } from "vitest";
import type { Contact } from "./contact.schema";
import { groupContacts, initialOf, initialsOf, toneFor } from "./contactDisplay";

const make = (id: number, name: string): Contact => ({
  id,
  name,
  email: `${id}@example.com`,
  phone: "",
  createdAt: "2026-10-01T09:30:00.000Z",
});

describe("contactDisplay", () => {
  it("takes the first letter, ignoring case and accents", () => {
    expect(initialOf("asha")).toBe("A");
    expect(initialOf("\u00c9kta")).toBe("E");
  });

  it("files digits and non-Latin names under #", () => {
    expect(initialOf("9Lives")).toBe("#");
    expect(initialOf("\u0c05\u0c28\u0c3f\u0c32\u0c4d")).toBe("#");
  });

  it("groups by letter, sorts names, and puts # last", () => {
    const groups = groupContacts([
      make(1, "Vikram Singh"),
      make(2, "9Lives"),
      make(3, "asha rao"),
      make(4, "Asha Kumar"),
    ]);
    expect(groups.map((g) => g.letter)).toEqual(["A", "V", "#"]);
    expect(groups[0].contacts.map((c) => c.name)).toEqual(["Asha Kumar", "asha rao"]);
  });

  it("builds initials from the first and last word", () => {
    expect(initialsOf("Asha Rao")).toBe("AR");
    expect(initialsOf("Madonna")).toBe("M");
    expect(initialsOf("   ")).toBe("?");
  });

    it("gives the same id the same colour and neighbours different ones", () => {
    expect(toneFor(7)).toBe(toneFor(7));
    expect(toneFor(1)).not.toBe(toneFor(2));
  });
});