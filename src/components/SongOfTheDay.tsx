import Reveal from "./Reveal";
import SongCard from "./SongCard";
import { getSongs } from "@/lib/wordpress";

/**
 * «Τραγούδι της ημέρας» — δεξιά στήλη της αρχικής.
 * Server Component: φέρνει τη λίστα από το WordPress (ISR) και τη δίνει
 * στην κάρτα, που διαλέγει το τραγούδι με την ημερομηνία του επισκέπτη.
 * Χωρίς τραγούδια (π.χ. η σελίδα δεν έχει φτιαχτεί ακόμη) δεν δείχνει τίποτα.
 */
export default async function SongOfTheDay({ delay }: { delay?: number }) {
  const songs = await getSongs();
  if (!songs.length) return null;

  return (
    <Reveal delay={delay}>
      <SongCard songs={songs} />
    </Reveal>
  );
}
