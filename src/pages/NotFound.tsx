
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-md w-full text-center p-8 rounded-lg shadow-lg bg-card border">
        <div className="w-20 h-20 bg-red-50 flex items-center justify-center rounded-full mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-primary">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! The page you're looking for can't be found
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          The page at <span className="font-medium text-foreground">{location.pathname}</span> doesn't exist
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" asChild className="w-full sm:w-auto">
            <Link to="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
