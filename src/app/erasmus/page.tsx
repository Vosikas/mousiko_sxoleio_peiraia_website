import ErasmusPage from "@/components/erasmus/ErasmusPage";
import { pageMetadata } from "@/content";

// Κείμενα: src/content/erasmus.ts · άρθρα: το blog Erasmus+ (src/lib/erasmus-blog.ts).
export const metadata = pageMetadata("erasmus");
export const revalidate = 300;

export default function Page() {
  return <ErasmusPage />;
}
