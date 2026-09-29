import StandalonePageTemplate from "@/components/section/StandalonePageTemplate";
import { pageMetadata } from "@/content";

// Περιεχόμενο: src/content/erasmus.ts · άρθρα: κατηγορία «Erasmus» του WordPress.
export const metadata = pageMetadata("erasmus");
// Τα άρθρα του WordPress ανανεώνονται κάθε 5 λεπτά, όπως στα Νέα.
export const revalidate = 300;

export default function Page() {
  return <StandalonePageTemplate page="erasmus" />;
}
