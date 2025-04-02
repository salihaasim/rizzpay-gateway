
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  credentials: {
    email: string;
    password: string;
  };
  selectedRole: string;
  demoCredentials: {
    [key: string]: {
      username: string;
      password: string;
    };
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  credentials,
  selectedRole,
  demoCredentials,
  onInputChange,
  onKeyDown,
  onBack,
  isLoading = false
}) => {
  return (
    <div className="space-y-4 py-4 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <Input
          name="email"
          value={credentials.email}
          onChange={onInputChange}
          placeholder="Enter your username"
          onKeyDown={onKeyDown}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Demo: {demoCredentials[selectedRole].username}
        </p>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          name="password"
          value={credentials.password}
          onChange={onInputChange}
          placeholder="Enter your password"
          type="password"
          onKeyDown={onKeyDown}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Demo: {demoCredentials[selectedRole].password}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
        >
          Back to Role Selection
        </Button>
        <Button
          variant="link"
          size="sm"
          className="text-primary"
          disabled={isLoading}
        >
          Forgot Password?
        </Button>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-2">
          <Loader2 className="h-4 w-4 text-primary animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Authenticating...</span>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
