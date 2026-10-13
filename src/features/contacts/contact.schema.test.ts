import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact.schema";

const valid = { name: "Asha Rao", email: "asha@example.com", phone: "" };

describe("contactSchema", () => {
  it("accepts a valid contact with an empty phone", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("trims the name and email", () => {
    const result = contactSchema.parse({
      ...valid,
      name: "  Meera  ",
      email: " meera@example.com ",
    });
    expect(result.name).toBe("Meera");
    expect(result.email).toBe("meera@example.com");
  });

  it("rejects an empty name with a clear message", () => {
    const result = contactSchema.safeParse({ ...valid, name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Enter a name.");
  });

  it("rejects malformed emails", () => {
    expect(contactSchema.safeParse({ ...valid, email: "a@@b.c" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "a@b..c" }).success).toBe(false);
  });

  it("accepts a phone with a country code and rejects letters", () => {
    expect(contactSchema.safeParse({ ...valid, phone: "+919876543210" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "12ab" }).success).toBe(false);
  });
});