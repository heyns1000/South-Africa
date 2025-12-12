import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import AuthForm from '@/components/AuthForm';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const { isAuthenticated } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = (data: { email: string; password: string }) => {
    login(data);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <div className="w-full max-w-md space-y-4">
        <AuthForm mode="login" onSubmit={handleSubmit} isLoading={isLoggingIn} />
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
