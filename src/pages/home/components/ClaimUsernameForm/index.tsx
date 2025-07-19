import { Button, Text, TextInput } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

const claimsUsernameFormSchema = z.object({
    username: z.string()
        .min(3, {message: 'O usuário deve ter pelo menos 3 letras.'})
        .regex(/^([a-z\\-]+)$/i, {
            message: 'O usuário deve conter apenas letras e hifens.'})
        .transform(username => username.toLowerCase())
})

type ClaimUsernameFormSchema = z.infer<typeof claimsUsernameFormSchema>

export function ClaimUsernameForm() {

    const { register, handleSubmit, formState: { errors } } = useForm<ClaimUsernameFormSchema>({
        resolver: zodResolver(claimsUsernameFormSchema)
    })

    const router = useRouter()

    const handleClaimUsername = async (data: ClaimUsernameFormSchema) => {
        const { username } = data
        await router.push(`/register?username=${username}`)
    }

    return (
        <>
            <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
                {/* @ts-ignore */}
                <TextInput size="sm" prefix="ignite.com/" placeholder="seu-usuário" {...register('username')} />
                <Button size="sm" type="submit">
                    Reservar
                    <ArrowRight />
                </Button>
            </Form>
        
            <FormAnnotation>
                <Text size="sm">
                    {errors.username ? errors.username.message : 'Digite o nome do usuário desejado.'}
                </Text>
            </FormAnnotation>
        </>
    );
}