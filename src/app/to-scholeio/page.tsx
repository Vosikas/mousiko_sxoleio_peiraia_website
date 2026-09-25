import SectionIndex from "@/components/section/SectionIndex";
import { sectionMetadata } from "@/content";

// Χωρίς WordPress: το περιεχόμενο ζει στο src/content/to-scholeio.ts.
export const metadata = sectionMetadata("to-scholeio");

export default function Page() {
  return <SectionIndex section="to-scholeio" />;
}
