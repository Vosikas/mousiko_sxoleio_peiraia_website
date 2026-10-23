import Reveal from "./Reveal";
import SongCard from "./SongCard";
import { getSongs } from "@/lib/songs";

/**
 * «Τραγούδι της ημέρας» — δεξιά στήλη της αρχικής.
 * Server Component: διαβάζει τα τραγούδια από το Excel (src/content/songs.ts)
 * και τα δίνει στην κάρτα, που διαλέγει με την ημερομηνία του επισκέπτη.
 * Χωρίς τραγούδια δεν δείχνει τίποτα.
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
