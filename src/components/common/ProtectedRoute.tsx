import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Center, Spinner, VStack, Text } from '@chakra-ui/react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <Center h="50vh">
                <VStack gap={4}>
                    <Spinner size="xl" color="var(--color-primary)" />
                    <Text ml={3}>Загрузка..</Text>
                </VStack>
            </Center>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
};