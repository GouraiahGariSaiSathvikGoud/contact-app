import { Button } from "../../components/Button";
import { ContactCard } from "./ContactCard";
import { anchorOf, groupContacts } from "./contactDisplay";
import { useContacts } from "./contacts.api";

const RAIL = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"];

type ContactListProps = { className?: string; highlightId?: number };

export function ContactList({ className, highlightId }: ContactListProps) {
  const { data, isPending, isError, refetch, isRefetching } = useContacts();
  const groups = data ? groupContacts(data) : [];
  const present = new Set(groups.map((g) => g.letter));

  return (
    <section aria-labelledby="saved-heading" className={className}>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 id="saved-heading" className="font-display text-xl font-bold">Saved contacts</h2>
        {data && data.length > 0 && (
          <span className="text-sm text-text-muted">
            {data.length} {data.length === 1 ? "person" : "people"}
          </span>
        )}
      </div>

      {isPending && (
        <div>
          <p role="status" className="mb-3 text-text-muted">Loading contacts…</p>
          <div aria-hidden="true" className="grid gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[4.5rem] animate-pulse rounded-2xl bg-border" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <div role="alert" className="grid justify-items-start gap-3 rounded-2xl border border-danger bg-surface p-5">
          <p>We could not load your contacts.</p>
          <Button variant="secondary" isLoading={isRefetching} onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {data && data.length === 0 && (
        <p className="rounded-2xl border border-dashed border-field p-6 text-text-muted">
          No contacts yet. Add your first one using the form.
        </p>
      )}

      {data && data.length > 0 && (
        <div className="flex items-start gap-4">
          <div className="grid min-w-0 flex-1 gap-6">
            {groups.map(({ letter, contacts }) => (
              <section
                key={letter}
                id={anchorOf(letter)}
                aria-labelledby={`${anchorOf(letter)}-title`}
                className="grid scroll-mt-8 grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-3"
              >
                <h3
                  id={`${anchorOf(letter)}-title`}
                  className="sticky top-4 grid size-11 place-items-center rounded-xl bg-marigold font-display text-xl font-extrabold text-text"
                >
                  {letter}
                </h3>
                <ul className="@container overflow-hidden rounded-2xl border border-border bg-surface">
                  {contacts.map((contact) => (
                    <li key={contact.id} className="border-b border-border last:border-b-0">
                      <ContactCard contact={contact} highlight={contact.id === highlightId} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <nav aria-label="Jump to letter" className="sticky top-8 hidden md:block">
            <ul>
              {RAIL.map((letter) =>
                present.has(letter) ? (
                  <li key={letter}>
                    <a
                      href={`#${anchorOf(letter)}`}
                      aria-label={`Jump to ${letter}`}
                      className="grid size-6 place-items-center rounded-md text-xs font-bold text-text hover:bg-marigold"
                    >
                      {letter}
                    </a>
                  </li>
                ) : (
                  <li
                    key={letter}
                    aria-hidden="true"
                    className="grid size-6 place-items-center text-xs text-text-muted/40"
                  >
                    {letter}
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      )}
    </section>
  );
}