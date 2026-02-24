export default function UploadResult({
  data,
  requestId,
}: {
  data: {
    uploadId: string;
    strategy: string;
    totalRows: number;
    accepted: number;
    rejected: number;
    errors: Array<{ row: number; field: string; reason: string }>;
  };
  requestId: string;
}) {
  return (
    <div className="panel">
      <h3>Upload Result</h3>
      <p>requestId: {requestId}</p>
      <p>uploadId: {data.uploadId}</p>
      <p>strategy: {data.strategy}</p>
      <p>
        total: {data.totalRows} | accepted: {data.accepted} | rejected: {data.rejected}
      </p>
      {data.errors.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Row</th>
              <th>Field</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {data.errors.map((e, i) => (
              <tr key={`${e.row}-${e.field}-${i}`}>
                <td>{e.row}</td>
                <td>{e.field}</td>
                <td>{e.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
