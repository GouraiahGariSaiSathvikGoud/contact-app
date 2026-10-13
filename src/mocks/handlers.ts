import { http, HttpResponse } from "msw/http";
import { delay } from "msw/utils/delay";
import { contactSchema, type Contact } from "../features/contacts/contact.schema";

const API = import.meta.env.VITE_API_URL;
const wait = () => delay(import.meta.env.MODE === "test" ? 0 : 600);

const seed = (): Contact[] => [
  { id: 1, name: "Asha Rao", email: "asha@example.com", phone: "+919876543210", createdAt: "2026-10-01T09:30:00.000Z" },
  { id: 2, name: "Vikram Singh", email: "vikram@example.com", phone: "", createdAt: "2026-10-02T11:00:00.000Z" },
];

export let contacts: Contact[] = seed();
export const resetContacts = (next: Contact[] = seed()) => {
  contacts = next;
};

export const handlers = [
  http.get(`${API}/contacts`, async () => {
    await wait();
    return HttpResponse.json(contacts);
  }),

  http.post(`${API}/contacts`, async ({ request }) => {
    await wait();
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      const detail = parsed.error.issues.map((i) => ({
        loc: ["body", ...i.path],
        msg: i.message,
      }));
      return HttpResponse.json({ detail }, { status: 422 });
    }
    if (contacts.some((c) => c.email.toLowerCase() === parsed.data.email.toLowerCase())) {
      return HttpResponse.json({ detail: "Email already exists." }, { status: 409 });
    }
    const created: Contact = {
      id: Math.max(0, ...contacts.map((c) => c.id)) + 1,
      createdAt: new Date().toISOString(),
      ...parsed.data,
    };
    contacts = [...contacts, created];
    return HttpResponse.json(created, { status: 201 });
  }),
];