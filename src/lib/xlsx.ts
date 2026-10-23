/**
 * Ελάχιστος αναγνώστης .xlsx, χωρίς εξαρτήσεις — μόνο για τον server.
 *
 * Το .xlsx είναι zip με αρχεία XML. Διαβάζουμε από κάθε φύλλο το κείμενο
 * κάθε κελιού όπως φαίνεται και τον σύνδεσμό του, αν έχει: είτε hyperlink
 * (π.χ. «Ακρόαση» → YouTube) είτε τύπο =HYPERLINK("…"; "…").
 */
import { inflateRawSync } from "node:zlib";

/** Ένα κελί: το κείμενο όπως φαίνεται και (αν έχει) ο σύνδεσμός του. */
export type Cell = { text: string; href?: string };

/* ------------------------------------------------------------------ zip */

function unzip(buf: Buffer): Map<string, Buffer> {
  // Το «τέλος του καταλόγου» του zip είναι στα τελευταία ~64 KB.
  let end = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65_557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end === -1) throw new Error("δεν είναι αρχείο .xlsx");

  const files = new Map<string, Buffer>();
  const count = buf.readUInt16LE(end + 10);
  let p = buf.readUInt32LE(end + 16);
  for (let n = 0; n < count && buf.readUInt32LE(p) === 0x02014b50; n++) {
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLength = buf.readUInt16LE(p + 28);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLength);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const data = buf.subarray(start, start + size);
    files.set(name, method === 8 ? inflateRawSync(data) : data);
    p += 46 + nameLength + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  return files;
}

/* ------------------------------------------------------------------ xml */

const decode = (s: string) =>
  s.replace(/&(lt|gt|amp|quot|apos|#\d+|#x[0-9a-f]+);/gi, (m, e: string) => {
    const named: Record<string, string> = { lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" };
    if (named[e]) return named[e];
    const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1));
    return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
  });

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

/** Όλα τα <t> ενός κομματιού XML (χωρίς τη φωνητική γραφή <rPh>). */
const textRuns = (xml: string) =>
  decode([...xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, "").matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((m) => m[1]).join(""));

/** Κάθε σειρά χωριστά, χωρίς κενά και επαναλήψεις («Püsküllü\nPüsküllü» → «Püsküllü»). */
const tidy = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line, i, lines) => line && line !== lines[i - 1])
    .join(" ");

/** Οι σύνδεσμοι ενός αρχείου .rels: Id → Target. */
function relations(xml: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of (xml ?? "").matchAll(/<Relationship\b[^>]*>/g)) {
    const id = attr(m[0], "Id");
    const target = attr(m[0], "Target");
    if (id && target) map.set(id, decode(target));
  }
  return map;
}

/** «AB12» → [στήλη 27 (0 = A), γραμμή 11 (0 = 1η)] */
function position(ref: string): [number, number] {
  const m = ref.match(/^([A-Z]+)(\d+)$/);
  if (!m) return [-1, -1];
  const column = [...m[1]].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
  return [column, Number(m[2]) - 1];
}

/* ---------------------------------------------------------------- φύλλα */

/** Τα φύλλα του αρχείου, το καθένα ως γραμμές από κελιά. */
export function readXlsx(buf: Buffer): Cell[][][] {
  const files = unzip(buf);
  const xml = (name: string) => files.get(name)?.toString("utf8");

  const shared = [...(xml("xl/sharedStrings.xml") ?? "").matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((m) => textRuns(m[1]));
  const workbookRels = relations(xml("xl/_rels/workbook.xml.rels"));
  const sheets = [...(xml("xl/workbook.xml") ?? "").matchAll(/<sheet\b[^>]*>/g)]
    .map((m) => workbookRels.get(attr(m[0], "r:id") ?? ""))
    .filter((target): target is string => Boolean(target))
    .map((target) => (target.startsWith("/") ? target.slice(1) : `xl/${target}`));

  return sheets.map((path) => {
    const sheet = xml(path) ?? "";
    const rows: Cell[][] = [];
    const at = (row: number, column: number) => {
      const cells = (rows[row] ??= []);
      return (cells[column] ??= { text: "" });
    };

    for (const m of sheet.matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const [column, row] = position(attr(m[1], "r") ?? "");
      if (column < 0) continue;
      const type = attr(m[1], "t");
      const body = m[2] ?? "";
      const value = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      const text =
        type === "s" ? shared[Number(value)] ?? "" : type === "inlineStr" ? textRuns(body) : decode(value ?? "");
      const cell = at(row, column);
      cell.text = tidy(text);
      // =HYPERLINK("https://…"; "Ακρόαση")
      const formula = decode(body.match(/<f\b[^>]*>([\s\S]*?)<\/f>/)?.[1] ?? "");
      const link = formula.match(/HYPERLINK\(\s*"([^"]+)"/i)?.[1];
      if (link) cell.href = link;
    }

    // Hyperlinks του φύλλου (μπορεί να καλύπτουν και περιοχή, π.χ. E2:E9).
    const sheetRels = relations(xml(path.replace(/([^/]+)$/, "_rels/$1.rels")));
    for (const m of sheet.matchAll(/<hyperlink\b[^>]*>/g)) {
      const target = sheetRels.get(attr(m[0], "r:id") ?? "");
      if (!target) continue;
      const [from, to = from] = (attr(m[0], "ref") ?? "").split(":");
      const [c1, r1] = position(from);
      const [c2, r2] = position(to);
      for (let r = r1; r >= 0 && r <= r2; r++) for (let c = c1; c >= 0 && c <= c2; c++) at(r, c).href = target;
    }

    return Array.from(rows, (cells) => Array.from(cells ?? [], (cell) => cell ?? { text: "" }));
  });
}
