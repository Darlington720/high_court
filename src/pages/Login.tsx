import AuthForm from "../components/AuthForm";

export default function Login() {
  return (
    <div className=" min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="login" />
    </div>
  );
}
