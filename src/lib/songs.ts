import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseSongRows, type Song } from "./song-table";
import { readXlsx } from "./xlsx";
import { youtubeStatus } from "./youtube";

/**
 * «Τραγούδι της ημέρας»: όλα τα .xlsx του φακέλου SONGS_FOLDER (οδηγίες στο
 * src/content/songs.ts), όλα τα φύλλα τους. Μόνο για τον server.
 * Ένα αρχείο που δεν διαβάζεται γράφει προειδοποίηση στο log και παραλείπεται.
 */
export async function getSongs(): Promise<Song[]> {
  const songs = readSongFiles();
  // Κάθε βίντεο YouTube ελέγχεται μία φορά τη μέρα: σβησμένα παραλείπονται,
  // όσα δεν επιτρέπουν ενσωμάτωση ανοίγουν στο YouTube.
  const checked = await Promise.all(
    songs.map(async (song) => {
      if (song.source !== "youtube" || !song.embedId) return song;
      const status = await youtubeStatus(song.embedId);
      if (status === "gone") return null;
      return status === "no-embed" ? { ...song, noEmbed: true } : song;
    }),
  );
  return checked.filter((song) => song !== null);
}

function readSongFiles(): Song[] {
  // = SONGS_FOLDER. Γραμμένο κυριολεκτικά ώστε το Next.js να ανεβάζει στον
  // server ΜΟΝΟ αυτόν τον φάκελο (με μεταβλητή θα ανέβαζε όλο το project).
  const folder = path.join(process.cwd(), "data", "tragoudia");
  let files: string[];
  try {
    // «~$…» = προσωρινό αρχείο του Excel όσο το αρχείο είναι ανοιχτό.
    files = readdirSync(folder).filter((f) => /\.xlsx$/i.test(f) && !f.startsWith("~$")).sort();
  } catch {
    return [];
  }
  return files.flatMap((file) => {
    try {
      return readXlsx(readFileSync(path.join(folder, file))).flatMap(parseSongRows);
    } catch (err) {
      console.warn(`[τραγούδια] δεν διαβάστηκε το «${file}»:`, (err as Error).message);
      return [];
    }
  });
}
