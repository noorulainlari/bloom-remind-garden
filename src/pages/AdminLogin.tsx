
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, LogIn, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    console.log('Checking admin access for user:', user?.id);
    
    if (!user) {
      setCheckingAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      console.log('Admin check result:', { data, error });

      if (error) {
        console.error('Error checking admin status:', error);
        setError(`Database error: ${error.message}`);
        setCheckingAdmin(false);
        return;
      }

      if (data?.is_admin) {
        console.log('User is admin, redirecting to dashboard');
        navigate('/admin-dashboard');
      } else {
        console.log('User is not admin');
        setCheckingAdmin(false);
      }
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      setError('Unexpected error occurred');
      setCheckingAdmin(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Attempting login with:', { email });

    try {
      const { error } = await signIn(email, password);
      console.log('Sign in result:', { error });
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Login failed');
      }
      // Admin check will happen in useEffect after successful login
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if user is logged in but not admin
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don't have admin privileges to access this area.</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <h1 className="text-lg sm:text-2xl font-bold text-green-700">Plant Care Admin</h1>
          </div>
          <CardTitle className="text-lg sm:text-xl">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">Demo Login Details:</h3>
            <div className="text-xs sm:text-sm text-blue-700 space-y-1">
              <p><strong>Email:</strong> admin@demo.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@demo.com"
                className="text-sm sm:text-base"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="admin123"
                className="text-sm sm:text-base"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs sm:text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={loading}>
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <Button onClick={() => navigate('/')} variant="link" className="text-xs sm:text-sm">
              ← Back to Plant Care Tool
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
