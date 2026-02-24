import { useState } from "react";
import CsvUpload from "../components/CsvUpload";
import ErrorBanner from "../components/ErrorBanner";
import UploadResult from "../components/UploadResult";
import { bulkUploadCsv } from "../services/api";

export default function DataTransferPage() {
  const [result, setResult] = useState<{
    requestId: string;
    data: {
      uploadId: string;
      strategy: string;
      totalRows: number;
      accepted: number;
      rejected: number;
      errors: Array<{ row: number; field: string; reason: string }>;
    };
  } | null>(null);
  const [error, setError] = useState<{ message: string; requestId: string } | null>(null);

  const onUpload = async (file: File) => {
    const res = await bulkUploadCsv(file);
    if (res.ok) {
      setResult({ requestId: res.requestId, data: res.data });
      setError(null);
    } else {
      setError({ message: res.error.message, requestId: res.requestId });
    }
  };

  return (
    <div>
      <h2>Data Transfer</h2>
      {error && <ErrorBanner message={error.message} requestId={error.requestId} />}
      <CsvUpload onUpload={onUpload} />
      {result && <UploadResult requestId={result.requestId} data={result.data} />}
    </div>
  );
}
