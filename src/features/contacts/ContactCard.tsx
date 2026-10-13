import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import type { Contact } from "./contact.schema";
import { initialsOf, toneFor } from "./contactDisplay";

type ContactCardProps = { contact: Contact; highlight?: boolean };

export function ContactCard({ contact, highlight = false }: ContactCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlight) ref.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }, [highlight]);

  return (
    <div ref={ref} className={cn("flex items-start gap-4 px-4 py-3.5", highlight && "landed")}>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-2xl rounded-bl-sm font-display text-base font-bold",
          toneFor(contact.id),
        )}
      >
        {initialsOf(contact.name)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="break-words font-semibold text-text">{contact.name}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-text-muted">
          <a
            className="underline underline-offset-2 hover:text-text [overflow-wrap:anywhere]"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
          {contact.phone && (
            <a className="underline underline-offset-2 hover:text-text" href={`tel:${contact.phone}`}>
              {contact.phone}
            </a>
          )}
        </p>
      </div>
      <p className="hidden shrink-0 text-sm text-text-muted @sm:block">
        Added {new Date(contact.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
      </p>
    </div>
  );
}