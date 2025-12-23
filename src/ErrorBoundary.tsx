import React from 'react';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui', color: '#b91c1c' }}>
          <h1 style={{ fontSize: 20, marginBottom: 8 }}>App crashed</h1>
          <p style={{ whiteSpace: 'pre-wrap', color: '#111827' }}>{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
