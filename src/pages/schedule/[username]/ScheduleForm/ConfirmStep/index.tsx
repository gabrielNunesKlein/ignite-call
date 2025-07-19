import { ConfirmForm, FormActions, FormError, FormHeader } from './styles'
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { CalendarBlank, Clock } from 'phosphor-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { api } from '@/src/lib/axios'
import { useRouter } from 'next/router'

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'Nome precisa no minimo 3 caracteries.'}),
    email: z.string().email({ message: "E-mail invalido."}),
    observations: z.string().nullable()
})

type ConfirmationData = z.infer<typeof confirmFormSchema>

interface ConfirmStepProps {
    schedulingDate: Date
    onCancelConfimation: () => void;
}

export default function ConfirmStep({ schedulingDate, onCancelConfimation }: ConfirmStepProps) {

    const { register, handleSubmit, formState: 
        { isSubmitting, errors } } 
        = useForm({
            resolver: zodResolver(confirmFormSchema)
    })

    const router = useRouter()
    const username = router.query.username?.toString()

    async function handleConfirmScheduling(data: ConfirmationData){
        const { name, email, observations } = data

        await api.post(`users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate
        })

        onCancelConfimation()
    }

    const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY')
    const describedTime = dayjs(schedulingDate).format('HH:mm[h]')

    return (
        <ConfirmForm as="Form" onSubmit={handleSubmit(handleConfirmScheduling)}>
            <FormHeader>
                <Text>
                    <CalendarBlank />
                    {describedDate}
                </Text>
                <Text>
                    <Clock />
                    {describedTime}
                </Text>
            </FormHeader>

            <label htmlFor="">
                <Text size="sm">Nome Completo</Text>
                {/*@ts-ignore*/}
                <TextInput placeholder={"Seu Nome"} {...register('name')} />
                {errors.name && (
                    <FormError size={"$sm"}>
                        {errors.name.message}
                    </FormError>
                )}
            </label>

            <label htmlFor="">
                <Text size="sm">Endereço de E-mail</Text>
                {/*@ts-ignore*/}
                <TextInput placeholder={"Seu E-mail"} type={'email'} {...register('email')} />
                {errors.email && (
                    <FormError size={"$sm"}>
                        {errors.email.message}
                    </FormError>
                )}
            </label>

            <label htmlFor="">
                <Text size="sm">Observações</Text>
                <TextArea {...register('observations')} />
            </label>

            <FormActions>
                <Button type="button" variant="tertiary" onClick={onCancelConfimation}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                    Confirmar
                </Button>
            </FormActions>
        </ConfirmForm>
    )
}
