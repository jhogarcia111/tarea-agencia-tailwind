import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, sendPasswordRecoveryEmail } = useData();
  const navigate = useNavigate();

  // Console log to debug
  useEffect(() => {
    console.log("Login component mounted");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor ingrese email y contraseña');
      return;
    }
    
    console.log(`Intentando iniciar sesión con: ${email}`);
    const result = login(email, password);
    
    if (result.success) {
      toast.success('Inicio de sesión exitoso');
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Por favor ingrese su correo electrónico para recuperar la contraseña');
      return;
    }

    const result = sendPasswordRecoveryEmail(email);
    if (result.success) {
      toast.success('Correo de recuperación enviado con éxito');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Agencia de Marketing</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@agencia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-brand-500 hover:bg-brand-600"
          >
            Iniciar Sesión
          </Button>
          <Button 
            variant="link" 
            onClick={handleForgotPassword} 
            className="w-full text-sm text-brand-500 mt-2"
          >
            Olvidé mi contraseña
          </Button>
        </CardFooter>
        <div className="px-6 py-4 text-center text-sm">
          <p className="text-gray-500">
            Usuario para pruebas: <span className="font-semibold">admin@agencia.com</span>
          </p>
          <p className="text-gray-500">
            Contraseña: <span className="font-semibold">admin123</span>
          </p>
        </div>
      </Card>
    </div>
  );
}
