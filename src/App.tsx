import { useState } from "react";
import "./styles/global.css";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "./lib/supabase";

const createUserFormSchema = z.object({
  avatar: z.instanceof(FileList)
    .transform(list => list.item(0)!)
    .refine(file => file.size <= 5 * 1024 * 1024, "A imagem precisa ter no máximo 5MB"),
  name: z.string()
    .nonempty("O nome é obrigatório")
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ');
    }),
  email: z.string()
    .nonempty("O email é obrigatório")
    .email("Formato de email inválido")
    .toLowerCase()
    .refine(email => {
      return email.endsWith("@gmail.com")
    }, "O email precisa ser da google"),
  password: z.string()
    .min(6, "A senha precisa ter 6 caracteres"),
  techs: z.array(z.object({
    title: z.string().nonempty("O titulo é obrigatorio"),
    knowledge: z.coerce.number().min(1).max(100),
  })).min(2, "Insira pelo menos 2 tecnologias")
})

type CreateUserFromData = z.infer<typeof createUserFormSchema>

export function App() {
  const [output, setOutput] = useState('');
  const { register, handleSubmit, formState: { errors }, control } = useForm<CreateUserFromData>({
    resolver: zodResolver(createUserFormSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "techs",
  })

  async function createUser(data: CreateUserFromData) {
    await supabase.storage.from("FormReact").upload(data.avatar.name, data.avatar)
    setOutput(JSON.stringify(data, null, 2));
  }

  function addNewTech() {
    append({ title: "", knowledge: 0, })
  }

  return (
    <main className="h-screen bg-zinc-50 flex items-center justify-center flex-col gap-10">
      <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit(createUser)}>

        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            accept="image/*"
            {...register("avatar")}
          />
          {errors.avatar && <span className="text-red-500 text-sm">{errors.avatar.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("name")}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("email")}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1" >
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="border border-zinc-200 shadow-sm rounded h-10 px-3"
            {...register("password")}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1" >
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button type="button" onClick={addNewTech} className="text-emerald-500 text-sm">Adicionar</button>
          </label>
          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>

                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="text"
                    className="border border-zinc-200 shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && <span className="text-red-500 text-sm">{errors.techs?.[index]?.title?.message}</span>}
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 border border-zinc-200 shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && <span className="text-red-500 text-sm">{errors.techs?.[index]?.knowledge?.message}</span>}
                </div>
              </div>
            )
          })}
          {errors.techs && <span className="text-red-500 text-sm">{errors.techs.message}</span>}
        </div>

        <button type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}
