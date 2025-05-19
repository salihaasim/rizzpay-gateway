
import React from 'react';

interface DemoCredentialsInfoProps {
  activeRole: string;
}

const DemoCredentialsInfo = ({ activeRole }: DemoCredentialsInfoProps) => {
  return (
    <div className="mt-4 text-center text-sm text-muted-foreground">
      <p>Demo credentials:</p>
      {activeRole === 'admin' ? (
        <>
          <p>Username: rizzpay</p>
          <p>Password: rizzpay123</p>
        </>
      ) : (
        <>
          <p>Username: merchant</p>
          <p>Password: password</p>
        </>
      )}
    </div>
  );
};

export default DemoCredentialsInfo;
