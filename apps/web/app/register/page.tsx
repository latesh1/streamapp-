import AuthForm from "../../components/AuthForm";

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black">
            <AuthForm type="register" />
        </div>
    );
}
