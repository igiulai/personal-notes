import { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "../FormField";
import { Button } from "../Button";
import { useForm } from "react-hook-form";
import "./RegisterForm.css";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/User";
import { queryClient } from "../../api/queryClient";

interface IRegisterFormProps {}

const RegisterSchema = z.object({
  username: z
  .string()
  .min(1, "Username can't be empty."),
  email: z.string().email("Enter correct email."),
  password: z.string().min(8, "Password must be 8 symbols or more."),
});

type RegisterForm = z.infer<typeof RegisterSchema>;

export const RegisterForm: FC<IRegisterFormProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
  });

  const registerMutation = useMutation(
    {
      mutationFn: (data: {
        username: string;
        email: string;
        password: string;
      }) => registerUser(data.username, data.email, data.password),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
    },
    queryClient
  );

    return (
    <form className="register-form" onSubmit={handleSubmit(({ username, email, password }) => {
      registerMutation.mutate({ username, email, password });
    })}>
      <FormField label="Имя" errorMessage={errors.username?.message}>
        <input
          type="text" {...register("username")}
        />
      </FormField>

      <FormField label="Email" errorMessage={errors.email?.message}>
        <input
          type="email" {...register("email")}
        />
      </FormField>

      <FormField label="Пароль" errorMessage={errors.password?.message}>
        <input
          type="password" {...register("password")}
        />
      </FormField>

      {registerMutation.error && (
        <span className="error-message">{registerMutation.error.message}</span>
        )}

      <Button type="submit" isLoading={registerMutation.isPending}>Зарегистрироваться</Button>
    </form>
  );
};
