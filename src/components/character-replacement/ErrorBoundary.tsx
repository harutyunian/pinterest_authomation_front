import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class CharacterReplacementErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || 'Something went wrong.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Character replacement error:', error, info);
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          severity="error"
          sx={{ my: 3 }}
          action={
            <Button color="inherit" size="small" onClick={this.handleReset}>
              Try again
            </Button>
          }
        >
          {this.state.message}
        </Alert>
      );
    }

    return this.props.children;
  }
}
