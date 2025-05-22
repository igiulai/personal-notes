import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "../Button";
import { FormField } from "../FormField";
import { createNote } from "../../api/Note";
import { queryClient } from "../../api/queryClient";
import "./NoteForm.css";

const NoteSchema = z.object({
  title: z.string().min(1, "Title can't be empty."),
  text: z
  .string()
  .min(10, "Text must contain 10 symbols or more.")
  .max(300, "Maximum length is 300 symbols."),
});

type NoteForm = z.infer<typeof NoteSchema>;

export const NoteForm: FC = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
   } = useForm<NoteForm>({
    resolver: zodResolver(NoteSchema),
  });

  const NoteMutation = useMutation(
    {
      mutationFn: (data: { title: string; text: string }) =>
      createNote(data.title, data.text),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      },
    },
    queryClient
  );

  return (
    <form 
    className="note-form" 
    onSubmit={handleSubmit(({ title, text }) => {
      NoteMutation.mutate({ title, text });
    })}
    >
      <FormField label="Заголовок" errorMessage={errors.title?.message}>
        <input type="text" {...register("title")} />
      </FormField>

      <FormField label="Текст" errorMessage={errors.text?.message}>
        <textarea {...register("text")} />
      </FormField>

      <Button
        type="submit"
        isLoading={NoteMutation.isPending}>Сохранить</Button>
    </form>
  );
};
