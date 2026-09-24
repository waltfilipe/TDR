import { IdpCapaPage } from "@/components/IdpCapaPage";
import { getReport } from "@/lib/report";

export default function HomePage() {
  const report = getReport();
  return <IdpCapaPage report={report} />;
}
