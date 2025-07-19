import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { Container, Header } from "../styles";
import { ArrowRight, Check } from "phosphor-react";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function ConnectCalendar(){

    const session = useSession();
    const router = useRouter()

    const isSignIn = session.status === 'authenticated'
    const hasAuthError = !!router.query.error

    async function handleToNextStep(){
        router.push('/register/time-intervals')
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">
                    Conect sua agenda
                </Heading>
                <Text>
                    Conecte seu calendário para verificar automaticamente os horários ocupados e encontrar os melhores horários para agendar sua consulta.
                </Text>
                <MultiStep size={4} currentStep={2} />
            </Header>

            <ConnectBox>
                <ConnectItem>
                    <Text>Google Calander</Text>
                    {isSignIn ? (
                        <Button disabled variant="secondary" size="sm">
                            Conectado
                            <Check />
                        </Button>
                    ): (
                        <Button variant="secondary" size="sm" onClick={() => signIn('google')}>
                            Conectar
                            <ArrowRight />
                        </Button>
                    )}
                </ConnectItem>

                {hasAuthError && (
                    <AuthError size="sm">
                        Falha ao se conectar ao Google, verifique se você habilitou as permissões de acesso ao Google Calender
                    </AuthError>
                )}

                <Button type="submit" disabled={!isSignIn} onClick={handleToNextStep}>
                    Próximo passo
                    <ArrowRight />
                </Button>
            </ConnectBox>
        </Container>
    )
}