import { useEffect } from "react";
import { useRouter } from "next/router";

export default function BulkUploadAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/data-transfer");
  }, [router]);
  return null;
}
