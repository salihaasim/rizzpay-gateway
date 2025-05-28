
import React from 'react';
import { Button } from "@/components/ui/button";
import { EyeOff, Eye } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ResponsiveControlsProps {
  navHidden: boolean;
  toggleNavVisibility: () => void;
}

const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  navHidden,
  toggleNavVisibility
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleNavVisibility}
      className="md:flex lg:hidden"
      title={navHidden ? "Show navigation" : "Hide navigation"}
    >
      {navHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </Button>
  );
};

export default ResponsiveControls;
