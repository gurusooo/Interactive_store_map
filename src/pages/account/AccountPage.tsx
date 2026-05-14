import React, { useEffect, useState } from "react";
import {
    Box, Container, Button, Spinner, Heading
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { FiLogOut, FiCheck } from "react-icons/fi";
import { useAuthStore } from "../../stores/authStore";
import { useProfileStore } from "../../stores/profileStore";
import { ConfirmModal } from "../../components/account/ConfirmModal";
import styles from "./AccountPage.module.css";
import { FaPen } from "react-icons/fa6";

const AccountPage: React.FC = () => {
    const { user, signOut } = useAuthStore();
    const { profile, loadProfile, updateDisplayName, isLoading: profileLoading } = useProfileStore();
    const toast = useToast();
    const [isEditingName, setIsEditingName] = useState(false);
    const [editNameValue, setEditNameValue] = useState("");
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const displayName = profile?.display_name || profile?.username || "Пользователь";
    const MAX_NAME_LENGTH = 16;

    useEffect(() => {
        if (user?.id) {
            void loadProfile(user.id);
        }
    }, [user, loadProfile]);

    const handleEditName = async () => {
        if (!editNameValue.trim()) {
            toast({ title: "Имя не может быть пустым", status: "error", duration: 2000 });
            setIsEditingName(false);
            return;
        }

        if (editNameValue === displayName) {
            setIsEditingName(false);
            return;
        }

        try {
            await updateDisplayName(editNameValue);
            setIsEditingName(false);
            toast({ title: "Имя обновлено!", status: "success", duration: 2000 });
        } catch (error) {
            toast({ title: "Ошибка при обновлении имени", status: "error", duration: 2000 });
            setIsEditingName(false);
        }
    };

    const handleLogout = async () => {
        setIsLogoutModalOpen(false);
        await signOut();
        toast({ title: "До свидания!", status: "info", duration: 2000 });
    };

    if (profileLoading) {
        return (
            <Container maxW="container.xl" py={8}>
                <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
                    <Spinner size="xl" color="var(--color-primary)" />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="100%" py={0} px={0}>
            <Box className={styles.page}>
                <Box className={styles.topSection}>
                    <Heading as="h1" size="lg" className={styles.title}>
                        Аккаунт
                    </Heading>

                    <Button
                        onClick={() => setIsLogoutModalOpen(true)}
                        variant="ghost"
                        size="sm"
                        className={styles.logoutButton}
                        _hover={{ bg: "rgba(255, 255, 255, 0.15)" }}
                    >
                        <FiLogOut size={24} />
                    </Button>
                </Box>

                <Box className={styles.banner} />

                <Box className={styles.profileSection}>
                    <Box className={styles.avatar}>
                        {displayName.charAt(0).toUpperCase()}
                    </Box>

                    <Box className={styles.profileInfo}>
                        {isEditingName ? (
                            <div className={styles.editNameContainer}>
                                <input
                                    type="text"
                                    value={editNameValue}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (value.length <= MAX_NAME_LENGTH) {
                                            setEditNameValue(value);
                                        }
                                    }}
                                    className={styles.nameInput}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            void handleEditName();
                                        }
                                    }}
                                />

                                <button
                                    onClick={handleEditName}
                                    className={styles.checkButton}
                                >
                                    <FiCheck size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className={styles.nameContainer}>
                                <span className={styles.username}>
                                    {displayName}
                                </span>

                                <FaPen
                                    size={16}
                                    className={styles.editIcon}
                                    onClick={() => {
                                        setEditNameValue(displayName);
                                        setIsEditingName(true);
                                    }}
                                />
                            </div>
                        )}

                        <div className={styles.email}>
                            {user?.email}
                        </div>
                    </Box>
                </Box>

                <footer className={styles.footer}>
                    <div className={styles.contacts}>
                        <p>Контакты:</p>
                        <p>+7 (123)-456-78-90</p>
                        <p>г. Бор, ул. Кожедуба, 1</p>
                        <p>tg: @gurusoooda</p>
                    </div>
                    <p className={styles.copy}>© 2025 Yummies' Cart. Все права защищены.</p>
                </footer>
            </Box>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                title="Выйти из аккаунта?"
                message="Вы уверены, что хотите выйти?"
                confirmText="Выйти"
                confirmColor="var(--color-accent)"
            />
        </Container>
    );
}

export default AccountPage;