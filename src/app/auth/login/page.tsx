import LoginForm from "./LoginForm";

export default function SignupPage() {
  return (
    <div className="flex justify-end items-center min-h-screen px-8 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}