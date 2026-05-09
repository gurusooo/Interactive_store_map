import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import styles from "./LoginPage.module.css";
import cartIcon from "../../assets/cart.svg";

export function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signIn, signUp } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add("login-page");
        return () => {
            document.body.classList.remove("login-page");
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            navigate("/", { replace: true });
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <img src={cartIcon} alt="Yummies' Cart" className={styles.logo} />
                    <h1 className={styles.title}>Yummies' Cart</h1>
                </div>

                <h2 className={styles.subtitle}>
                    {isLogin ? 'Добро пожаловать!' : 'Присоединяйтесь сейчас!'}
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputWrapper}>
                        <input
                            type='text'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            type='password'
                            placeholder='Пароль'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error}>{error}</div>}
                    </div>

                    <button
                        type='submit'
                        disabled={
                            isSubmitting ||
                            (isLogin && (!email || !password))
                        }
                        className={styles.button}
                    >
                        {isSubmitting
                            ? (isLogin ? 'Вход...' : 'Регистрация...')
                            : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>

                <div className={styles.footerText}>
                    {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className={styles.linkButton}
                    >
                        {isLogin ? 'Создать аккаунт' : 'Войти'}
                    </button>
                </div>
            </div>
        </div>
    );
}