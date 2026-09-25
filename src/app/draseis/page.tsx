import SectionIndex from "@/components/section/SectionIndex";
import { sectionMetadata } from "@/content";

// Το περιεχόμενο ζει στο src/content/draseis.ts.
export const metadata = sectionMetadata("draseis");

export default function Page() {
  return <SectionIndex section="draseis" />;
}
