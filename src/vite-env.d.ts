// ============ Firebase ============
// interface ImportMetaEnv {
//     readonly VITE_FIREBASE_API_KEY: string;
//     readonly VITE_AUTH_DOMAIN: string;
//     readonly VITE_PROJECT_ID: string;
//     readonly VITE_STORAGE_BUCKET: string;
//     readonly VITE_MESSAGING_SENDER: string;
//     readonly VITE_APP_ID: string;
//     readonly VITE_MEASUREMENT_ID: string;
// }

// ============ Supabase ============
interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.png' {
    const value: string;
    export default value;
}