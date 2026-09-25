import type { ReactNode } from "react";
import type { Block } from "@/content/types";

/**
 * Ζωγραφίζει τα «τουβλάκια» μιας υποσελίδας, το καθένα σε γκρι κουτί
 * (.surface-box) με μωβ τονισμούς — το μοτίβο όλου του site.
 * Νέος τύπος τουβλακιού: πρόσθεσέ τον στο src/content/types.ts και εδώ.
 */
export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return (
        <Box title={block.title}>
          <div className="max-w-3xl space-y-4 text-[1.02rem] leading-[1.8] text-cream/85">
            {block.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Box>
      );

    case "list":
      return (
        <Box title={block.title}>
          {block.intro && <p className="mb-5 leading-relaxed text-muted">{block.intro}</p>}
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {block.items.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-plum-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Box>
      );

    case "facts":
      return (
        <Box title={block.title}>
          <dl className="grid grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-3">
            {block.items.map((fact) => (
              // Σημασιολογικά πρώτα η ετικέτα, οπτικά πρώτα ο αριθμός.
              <div key={fact.label} className="flex flex-col">
                <dt className="order-2 mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-muted">{fact.label}</dt>
                <dd className="order-1 font-display text-4xl font-semibold surface-box-accent">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Box>
      );

    case "documents":
      return (
        <Box title={block.title}>
          <ul className="divide-y divide-cream/10">
            {block.items.map((doc) => (
              <li key={doc.title} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-plum-500"
                >
                  <FileIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium leading-snug">{doc.title}</p>
                  {doc.meta && <p className="mt-0.5 text-sm text-muted">{doc.meta}</p>}
                </div>
                {doc.href ? (
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost shrink-0 rounded-full border bg-white px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.18em]"
                  >
                    Άνοιγμα<span className="sr-only">: {doc.title}</span>
                  </a>
                ) : (
                  <span className="shrink-0 rounded-full border border-cream/15 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                    Σύντομα
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Box>
      );

    case "contact":
      return (
        <Box title={block.title}>
          <dl className="divide-y divide-cream/10">
            {block.items.map((item) => (
              <div
                key={item.label}
                className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4 first:pt-0 last:pb-0"
              >
                <dt className="w-44 shrink-0 text-sm text-muted">{item.label}</dt>
                <dd className="min-w-0 text-lg">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="break-all text-plum-500 underline decoration-plum-500/30 underline-offset-4 transition hover:decoration-plum-500"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Box>
      );

    default: {
      // Αν προστεθεί τύπος στο types.ts χωρίς case εδώ, το TypeScript θα διαμαρτυρηθεί.
      const unhandled: never = block;
      return unhandled;
    }
  }
}

/** Το γκρι κουτί. Με τίτλο γίνεται <section>, χωρίς τίτλο απλό <div>. */
function Box({ title, children }: { title?: string; children: ReactNode }) {
  const Tag = title ? "section" : "div";
  return (
    <Tag className="surface-box p-7 sm:p-10">
      {title && <h2 className="mb-5 font-display text-xl font-semibold sm:text-2xl surface-box-accent">{title}</h2>}
      {children}
    </Tag>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
