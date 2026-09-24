import { IdpReport } from "@/components/IdpReport";
import { getReport } from "@/lib/report";

export default function HomePage() {
  const report = getReport();
  return <IdpReport report={report} />;
}
