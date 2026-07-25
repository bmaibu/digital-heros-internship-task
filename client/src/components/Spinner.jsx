export function Spinner({ label = 'Loading' }) { return <div className="spinner-wrap"><span className="spinner" aria-label={label} /> <span>{label}</span></div>; }
