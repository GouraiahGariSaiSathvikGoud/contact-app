import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw/http";
import { describe, expect, it } from "vitest";
import { resetContacts } from "../../mocks/handlers";
import { server } from "../../mocks/server";
import { renderWithClient } from "../../test/render";
import { ContactsPage } from "./ContactsPage";

const API = import.meta.env.VITE_API_URL;

describe("ContactsPage", () => {
  it("shows a loading message, then the contacts grouped by letter", async () => {
    renderWithClient(<ContactsPage />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading contacts…");
    expect(await screen.findByText("Asha Rao")).toBeInTheDocument();
    expect(screen.getByText("Vikram Singh")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "A", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "V", level: 3 })).toBeInTheDocument();
    expect(screen.getByText("2 people")).toBeInTheDocument();
  });

  it("shows an empty message when there are no contacts", async () => {
    resetContacts([]);
    renderWithClient(<ContactsPage />);

    expect(
      await screen.findByText("No contacts yet. Add your first one using the form."),
    ).toBeInTheDocument();
  });

  it("shows an error, then recovers when Try again is clicked", async () => {
    server.use(
      http.get(`${API}/contacts`, () => HttpResponse.json({ detail: "boom" }, { status: 500 }), {
        once: true,
      }),
    );
    const user = userEvent.setup();
    renderWithClient(<ContactsPage />);

    expect(await screen.findByText("We could not load your contacts.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Asha Rao")).toBeInTheDocument();
  });

  it("treats a response of the wrong shape as an error", async () => {
    server.use(http.get(`${API}/contacts`, () => HttpResponse.json([{ id: "x" }])));
    renderWithClient(<ContactsPage />);

    expect(await screen.findByText("We could not load your contacts.")).toBeInTheDocument();
  });

  it("shows a validation message after leaving the name empty", async () => {
    const user = userEvent.setup();
    renderWithClient(<ContactsPage />);

    await user.click(screen.getByLabelText("Name"));
    await user.tab();

    expect(await screen.findByText("Enter a name.")).toBeInTheDocument();
  });

  it("adds a contact, clears the form, and shows the new person in the list", async () => {
    const user = userEvent.setup();
    renderWithClient(<ContactsPage />);
    await screen.findByText("Asha Rao");

    await user.type(screen.getByLabelText("Name"), "Meera Nair");
    await user.type(screen.getByLabelText("Email"), "meera@example.com");
    await user.click(screen.getByRole("button", { name: "Add contact" }));

    expect(await screen.findByText("Meera Nair")).toBeInTheDocument();
    expect(screen.getByText("3 people")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
  });

  it("shows the duplicate-email error under Email and keeps what was typed", async () => {
    const user = userEvent.setup();
    renderWithClient(<ContactsPage />);
    await screen.findByText("Asha Rao");

    await user.type(screen.getByLabelText("Name"), "Another Asha");
    await user.type(screen.getByLabelText("Email"), "ASHA@example.com");
    await user.click(screen.getByRole("button", { name: "Add contact" }));

    expect(
      await screen.findByText("A contact with this email already exists."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Another Asha");
    expect(screen.getByLabelText("Email")).toHaveValue("ASHA@example.com");
    expect(screen.getAllByText("Asha Rao")).toHaveLength(1);
  });

  it("shows a general message when saving fails on the server", async () => {
    server.use(http.post(`${API}/contacts`, () => HttpResponse.json({}, { status: 500 })));
    const user = userEvent.setup();
    renderWithClient(<ContactsPage />);
    await screen.findByText("Asha Rao");

    await user.type(screen.getByLabelText("Name"), "Meera Nair");
    await user.type(screen.getByLabelText("Email"), "meera@example.com");
    await user.click(screen.getByRole("button", { name: "Add contact" }));

    expect(
      await screen.findByText("Could not save the contact. Please try again."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Meera Nair");
  });
});