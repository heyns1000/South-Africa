import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import AuthForm from '@/components/AuthForm';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const { signup, isSigningUp } = useAuth();
  const { isAuthenticated } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = (data: SignupFormData) => {
    signup({ name: data.name, email: data.email, password: data.password });
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-md space-y-4">
        <AuthForm mode="signup" onSubmit={handleSubmit} isLoading={isSigningUp} />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
