import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Webhook άμεσης ανανέωσης.
 *
 * Στο WordPress (π.χ. με το πρόσθετο WP Webhooks ή ένα μικρό snippet στο
 * functions.php) καλέστε σε κάθε δημοσίευση:
 *   POST https://to-site-sas.gr/api/revalidate?secret=XXX&path=/
 *
 * Έτσι η αλλαγή φαίνεται αμέσως, χωρίς αναμονή για το ISR.
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: "Άκυρο μυστικό" }, { status: 401 });
  }

  const path = searchParams.get("path");
  const paths = path ? [path] : ["/", "/nea"];
  paths.forEach((p) => revalidatePath(p));

  return NextResponse.json({ ok: true, revalidated: paths, at: Date.now() });
}
