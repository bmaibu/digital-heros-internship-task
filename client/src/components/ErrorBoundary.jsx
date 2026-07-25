import { Component } from 'react';
export class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main className="center-page"><h1>We hit an unexpected snag.</h1><p>Refresh the page to try again.</p><button className="button primary" onClick={() => window.location.reload()}>Refresh page</button></main> : this.props.children; }
}
