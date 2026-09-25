import SubpageTemplate from "@/components/section/SubpageTemplate";
import { subpageMetadata, subpageParams } from "@/content";

type Props = { params: Promise<{ slug: string }> };

// Μόνο οι υποσελίδες του src/content/draseis.ts υπάρχουν· οτιδήποτε άλλο → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return subpageParams("draseis");
}

export async function generateMetadata({ params }: Props) {
  return subpageMetadata("draseis", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SubpageTemplate section="draseis" slug={(await params).slug} />;
}
