import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
  info: React.ErrorInfo | null;
  retryKey: number;
};

class AssistantErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, info: null, retryKey: 0 };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, info: null } as Partial<State>;
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log the error to the console and leave room to send to an external
    // error reporting service later (Sentry, LogRocket, etc.)
    // Keep logs focused to the assistant so it's easy to triage.
    // eslint-disable-next-line no-console
    console.error('AssistantErrorBoundary caught an error:', error, info);
    this.setState({ info });
  }

  handleRetry = () => {
    // Incrementing retryKey forces children to remount so the assistant can reset
    this.setState(prev => ({ hasError: false, error: null, info: null, retryKey: prev.retryKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Assistant temporarily unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              The Data Analysis Assistant ran into an error. You can try reloading the assistant without
              reloading the whole page.
            </p>
            <div className="flex gap-2">
              <Button onClick={this.handleRetry}>Try again</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>Reload page</Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Keyed wrapper forces a remount when retryKey changes
    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}

export default AssistantErrorBoundary;
