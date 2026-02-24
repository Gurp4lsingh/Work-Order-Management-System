export default function ErrorBanner({
  message,
  requestId,
}: {
  message: string;
  requestId?: string;
}) {
  return (
    <div className="error-banner">
      <strong>Error:</strong> {message}
      {requestId && <div>requestId: {requestId}</div>}
    </div>
  );
}
