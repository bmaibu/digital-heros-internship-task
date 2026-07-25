import { Link } from 'react-router-dom';
export function NotFoundPage() { return <main className="center-page"><p className="eyebrow">404</p><h1>That page has wandered off.</h1><p>The page you’re after doesn’t exist or has moved.</p><Link className="button primary" to="/">Back home</Link></main>; }
