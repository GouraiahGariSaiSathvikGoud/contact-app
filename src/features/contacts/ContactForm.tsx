import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { ApiError } from "../../lib/api";
import { cn } from "../../lib/cn";
import { contactSchema, type Contact, type ContactInput } from "./contact.schema";
import { useAddContact } from "./contacts.api";
import { rejectedFields } from "./serverErrors";

const fields = ["name", "email", "phone"] as const;

type ContactFormProps = {
  className?: string;
  onAdded?: (contact: Contact) => void;
};

export function ContactForm({ className, onAdded }: ContactFormProps) {
  const addContact = useAddContact();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", phone: "" },
  });

  async function onSubmit(values: ContactInput) {
    try {
      const created = await addContact.mutateAsync(values);
      reset();
      onAdded?.(created);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError("email", {
          type: "server",
          message: "A contact with this email already exists.",
        });
      } else if (error instanceof ApiError && error.status === 422) {
        const rejected = rejectedFields(error.body);
        for (const name of fields) {
          if (rejected.includes(name)) {
            setError(name, { type: "server", message: "The server did not accept this value." });
          }
        }
      } else {
        setError("root.server", {
          type: "server",
          message: "Could not save the contact. Please try again.",
        });
      }
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "relative grid content-start gap-4 rounded-2xl border border-border bg-surface p-5 pt-7",
        "before:absolute before:left-5 before:top-0 before:h-2.5 before:w-16 before:rounded-b-full before:bg-marigold",
        className,
      )}
    >
      <h2 className="font-display text-xl font-bold">Add a contact</h2>
      <Input label="Name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <Input
        label="Phone (optional)"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        hint="Digits only, with an optional + at the start."
        error={errors.phone?.message}
        {...register("phone")}
      />
      {errors.root?.server && (
        <p role="alert" className="text-sm text-danger">{errors.root.server.message}</p>
      )}
      <Button type="submit" isLoading={isSubmitting}>Add contact</Button>
    </form>
  );
}