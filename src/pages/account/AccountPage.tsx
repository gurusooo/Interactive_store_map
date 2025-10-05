import React from "react";
import { Box, Container, Heading, Text } from "@chakra-ui/react";

const AccountPage: React.FC = () => {
    return (
        <Container maxW="container.xl" py={8}>
            <Box textAlign="center">
                <Heading color="#f08c1f" mb={4} fontSize={{ base: "xl", md: "2xl" }}>
                    Ой! Данный раздел в разработке!
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }}>
                    Уже скоро здесь появятся возможности управления Вашим аккаунтом.
                </Text>

            </Box>
        </Container>
    );
};

export default AccountPage;
