import { Component, type ReactNode } from 'react';

export class ThreeErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('[Vinancial Capital] 3D model failed to load, showing poster fallback.', error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
