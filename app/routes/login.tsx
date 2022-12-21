import { Layout } from "~/components/layout";
import { FormField } from "~/components/form-field";
import React, { useState, useRef, useEffect } from "react";
import { validateEmail, validateName, validatePassword } from '~/Utils/validator.server'
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { login, register, getUser } from '~/Utils/auth.server'


export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect('/') : null
}




export const action: ActionFunction = async ({ request }) => {

  const form = await request.formData()
  const action = form.get("_action")
  const email = form.get("email")
  const password = form.get("password")
  let firstName = form.get("firstName")
  let lastName = form.get("lastName")


  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: "Dados inválidos no formulário", form: action }, { status: 400 })
  }

  if (
    action === 'register' && (
      typeof action !== "string" ||
      typeof email !== "string")
  ) {
    return json({ error: "Dados inválidos no formulário", form: action }, { status: 400 })
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === 'Registrar'
      ? {
        firstName: validateName((firstName as string) || ''),
        lastName: validateName((lastName as string) || ''),
      }
      : {}),
  }

  if (Object.values(errors).some(Boolean))
    return json({ errors, fields: { email, password, firstName, lastName }, form: action }, { status: 400 })

  switch (action) {
    case 'login': {
      return await login({ email, password })
    }
    case 'register': {
      firstName = firstName as string
      lastName = lastName as string
      return await register({ email, password, firstName, lastName })
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
}

export default function Login() {

  const actionData = useActionData()
  const [action, setAction] = useState('login')
  const firstLoad = useRef(true)
  const [errors, setErrors] = useState(actionData?.errors || {})
  const [formError, setFormError] = useState(actionData?.error || '')

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
    firstName: actionData?.fields?.lastName || '',
    lastName: actionData?.fields?.firstName || '',
  })


  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      }
      setErrors(newState)
      setFormError('')
      setFormData(newState)
    }
  }, [action])

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError('')
    }
  }, [formData])

  useEffect(() => { firstLoad.current = false }, [])




  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, field: string) {
    setFormData(form => ({
      ...form,
      [field]: event.target.value
    }));
  }
  return (
    <Layout>
      <div className="flex justify-center items-center flex-col gap-y-4">
        <button
          onClick={() => setAction(action == 'login' ? 'register' : 'login')}
          className="absolute top-8 right-3 bg-gray-500 rouded-xl mt-2 py-2 px-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-green-300 hover:-tranlate-y-1"
        >{action === 'login' ? 'Registrar' : 'Entrar'}</button>
        <h2 className="font-bold text-5xl text-white">
          Bem vindo ao GeoOne
        </h2>
        <p className="font-bold text-5xl text-white">{
          action === 'login' ? 'Faça seu Login' : 'Faça seu cadastro'
        }</p>
      </div>
      {/*  {
        JSON.stringify(formData)
      } */}
      <form method="POST" className="rounded-2xl bg-gray-200 p-6 w-96">

        <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">{formError}</div>



        < FormField
          htmlFor="email"
          label="Email"
          value={formData.email}
          onChange={e => handleInputChange(e, 'email')}
          error={errors?.email}
        />
        <FormField
          htmlFor="password"
          label="Senha"
          type="password"
          value={formData.password}
          onChange={e => handleInputChange(e, 'password')}
          error={errors?.password}
        />

        {action === 'register' && (
          <>
            < FormField
              htmlFor="firstName"
              label="Primeiro Nome"
              value={formData.firstName}
              onChange={e => handleInputChange(e, 'firstName')}
              error={errors?.firstName}
            />
            < FormField
              htmlFor="lastName"
              label="Sobrenome"
              value={formData.lastName}
              onChange={e => handleInputChange(e, 'lastName')}
              error={errors?.lastName}
            />
          </>
        )}


        <div className="w-full text-center">
          <button type="submit"
            name="_action"
            value={action}
            className="bg-gray-500 rouded-xl mt-2 py-2 px-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-green-300 hover:-tranlate-y-1"

          >
            {action === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </div>

      </form>


    </Layout>
  )
}
