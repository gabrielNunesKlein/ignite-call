import { Heading, Text } from "@ignite-ui/react";
import { Container, Hero, Previw } from "./styles";
import previewImage from "../../assets/app-preview.png";
import Image from "next/image";
import { ClaimUsernameForm } from "./components/ClaimUsernameForm";
import { NextSeo } from "next-seo";

export default function Home() {

    return (
        <>
            <NextSeo 
                title="Descimplique sua agenda | ignite-call"
                description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
            />
            <Container>
                <Hero>
                    <Heading size="4xl">
                        Agendamento desconplicado
                    </Heading>
                    <Text size="xl">
                        Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
                    </Text>

                    <ClaimUsernameForm />
                </Hero>

                <Previw>
                    <Image
                        src={previewImage}
                        alt="Preview da aplicação"
                        quality={100}
                        placeholder="blur"
                        height={400}
                        priority
                    />
                </Previw>
            </Container>
        </>
    );
}
