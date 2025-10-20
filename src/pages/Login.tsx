import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';

const Login = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Sign in to access the Loan Application System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={signInWithGoogle}
            className="w-full"
            size="lg"
            variant="outline"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our terms of service
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
