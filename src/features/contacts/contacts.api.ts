import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import {
  contactListSchema,
  savedContactSchema,
  type ContactInput,
} from "./contact.schema";

export const contactsOptions = queryOptions({
  queryKey: ["contacts"],
  queryFn: async ({ signal }) =>
    contactListSchema.parse(await api<unknown>("/contacts", { signal })),
});

export const useContacts = () => useQuery(contactsOptions);

export function useAddContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ContactInput) =>
      savedContactSchema.parse(
        await api<unknown>("/contacts", { method: "POST", body: JSON.stringify(input) }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contactsOptions.queryKey }),
  });
}