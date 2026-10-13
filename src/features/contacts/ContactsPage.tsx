import { useState } from "react";
import { PageLayout } from "../../components/PageLayout";
import { ContactForm } from "./ContactForm";
import { ContactList } from "./ContactList";

export function ContactsPage() {
  const [highlightId, setHighlightId] = useState<number>();

  return (
    <PageLayout>
      <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Contacts
      </h1>
      <div className="grid gap-8 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-10">
        <ContactForm
          className="md:sticky md:top-8 md:self-start"
          onAdded={(contact) => setHighlightId(contact.id)}
        />
        <ContactList highlightId={highlightId} />
      </div>
    </PageLayout>
  );
}