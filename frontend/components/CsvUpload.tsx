import { useState } from "react";

export default function CsvUpload({
  onUpload,
}: {
  onUpload: (file: File) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="panel">
      <h3>CSV Upload</h3>
      <p>Headers: title, description, department, priority, requesterName, assignee(optional)</p>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button disabled={!file} onClick={() => file && onUpload(file)}>
        Upload
      </button>
    </div>
  );
}
