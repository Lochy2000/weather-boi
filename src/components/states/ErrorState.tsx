import React from 'react';
import { Button } from '../ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  message = "We couldn't connect to the server (API error). Please try again in a few moments.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <img 
          src="/assets/images/icon-error.svg" 
          alt="Error" 
          className="mx-auto mb-6 h-16 w-16"
        />
        <h2 className="mb-4 text-3xl font-semibold text-neutral-0">
          Something went wrong
        </h2>
        <p className="mb-6 max-w-md text-neutral-300">
          {message}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="secondary" size="lg">
            <img 
              src="/assets/images/icon-retry.svg" 
              alt="Retry" 
              className="mr-2 h-4 w-4"
            />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}