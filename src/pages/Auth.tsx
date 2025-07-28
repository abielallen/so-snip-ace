import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      } else {
        navigate('/');
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Account Created', description: 'Please log in with your new credentials.' });
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-solana-darkblue">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="w-full">
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
          </form>
          <Button variant="link" className="w-full mt-2" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
