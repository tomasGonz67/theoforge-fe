import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../App';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Typography,
  IconButton,
  Alert
} from "@material-tailwind/react";

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'login') {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } else {
      setError('Registration is currently disabled. Please use test@test.com / test123');
    }
  };

  const handleTestLogin = () => {
    const success = login('test@test.com', 'test123');
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <IconButton
            variant="text"
            color="gray"
            size="sm"
            onClick={() => navigate('/')}
            className="hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </IconButton>
          <Typography variant="h4" color="blue-gray">
            Back to home
          </Typography>
        </div>

        <Card className="w-full">
          <CardHeader
            color="teal"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              {type === 'login' ? 'Welcome Back' : 'Create Account'}
            </Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-6">
            {error && (
              <Alert
                color="red"
                variant="ghost"
                className="mb-4"
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="email"
                  label="Email Address"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  containerProps={{
                    className: "min-w-0",
                  }}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  label="Password"
                  size="lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  containerProps={{
                    className: "min-w-0",
                  }}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                color="teal"
                className="mt-2"
                fullWidth
              >
                {type === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {type === 'login' && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  variant="outlined"
                  color="teal"
                  size="lg"
                  fullWidth
                  onClick={handleTestLogin}
                  className="flex items-center justify-center gap-3"
                >
                  Test Account
                </Button>
              </>
            )}
          </CardBody>

          <CardFooter className="pt-0">
            <Typography variant="small" className="mt-4 text-center">
              {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
              <Typography
                as="span"
                variant="small"
                color="teal"
                className="font-medium cursor-pointer"
                onClick={() => navigate(type === 'login' ? '/register' : '/login')}
              >
                {type === 'login' ? 'Sign Up' : 'Sign In'}
              </Typography>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}