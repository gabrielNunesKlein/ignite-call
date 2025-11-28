import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Form, FormError, Header } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "@/src/lib/axios";
import { AxiosError } from "axios";
import { NextSeo } from "next-seo";

const registerFormSchema = z.object({
    username: z.string()
        .min(3, { message: 'O usuário deve ter pelo menos 3 letras.' })
        .regex(/^([a-z\\-]+)$/i, {
            message: 'O usuário deve conter apenas letras e hifens.'
        })
        .transform(username => username.toLowerCase()),
    name: z.string()
        .min(3, { message: 'O nome completo deve ter pelo menos 3 letras.' })
})

type RegisterFormSchema = z.infer<typeof registerFormSchema>

export default function Register(){

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormSchema>({
        resolver: zodResolver(registerFormSchema)
    })

    const router = useRouter()

    useEffect(() => {

        if(router.query?.username) {
            setValue('username', String(router.query.username))
        }

    }, [router.query?.username, setValue])

    async function handleRegister(data: RegisterFormSchema) {
        try {

            await api.post('/users', {
                name: data.name,
                username: data.username
            })

            router.push('/register/connect-calendar')

        } catch(err){
            if(err instanceof AxiosError && err.response?.data.message) {
                alert(err.response.data.message)
                return
            }

            console.log(err)
            return
        }
    }

    return (
        <>
            <NextSeo 
                title="Crie sua conta"
            />
            <Container>
                <Header>
                    <Heading as="strong">
                        Bem-vindo ao Ignite Call!
                    </Heading>
                    <Text>
                        Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.
                    </Text>
                    <MultiStep size={4} currentStep={1} />
                </Header>

                <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                    <label>
                        <Text size="sm">Nome de usuário</Text>
                        {/* @ts-ignore */}
                        <TextInput prefix="ignite.com/" placeholder="seu-usuário" {...register('username')} />
                        {errors.username && (
                            <FormError size="sm">
                                {errors.username.message}
                            </FormError>
                        )}
                    </label>

                    <label>
                        <Text size="sm">Nome completo</Text>
                        {/* @ts-ignore */}
                        <TextInput placeholder="seu nome" {...register('name')} />
                        {errors.name && (
                            <FormError size="sm">
                                {errors.name.message}
                            </FormError>
                        )}
                    </label>
                    
                    <Button type="submit" disabled={isSubmitting}>
                        Próximo passo
                        <ArrowRight />
                    </Button>
                </Form>
            </Container>
        </>
    )
}