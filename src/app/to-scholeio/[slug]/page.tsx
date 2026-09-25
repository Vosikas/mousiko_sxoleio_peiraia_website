import SubpageTemplate from "@/components/section/SubpageTemplate";
import { subpageMetadata, subpageParams } from "@/content";

type Props = { params: Promise<{ slug: string }> };

// Μόνο οι υποσελίδες του src/content/to-scholeio.ts υπάρχουν· οτιδήποτε άλλο → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return subpageParams("to-scholeio");
}

export async function generateMetadata({ params }: Props) {
  return subpageMetadata("to-scholeio", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SubpageTemplate section="to-scholeio" slug={(await params).slug} />;
}
