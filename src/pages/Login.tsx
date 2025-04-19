import AuthForm from "../components/AuthForm";
import { SEO } from "../components/SEO";

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title={`Login | Educite Virtual Library`}
        description="Access thousands of educational documents, legal resources, and academic materials through Educite's comprehensive virtual library."
        keywords="virtual library, educational documents, e-documents, legal resources, academic materials"
        canonicalUrl="https://educitevl.edu.ug/login"
      />
      <AuthForm mode="login" />
    </div>
  );
}
