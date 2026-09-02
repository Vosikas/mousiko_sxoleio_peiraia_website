# Μουσικό Σχολείο Πειραιά — ιστοσελίδα

Next.js 16 (App Router) + Tailwind CSS 4, με **headless WordPress** ως πηγή περιεχομένου.
Το προσωπικό του σχολείου γράφει κανονικά στο WordPress· η σελίδα ενημερώνεται μόνη της.

---

## Γρήγορη εκκίνηση

```bash
npm install
cp .env.example .env.local   # συμπληρώστε τις τιμές
npm run dev                  # http://localhost:3000
```

Χρήσιμες εντολές:

| Εντολή          | Τι κάνει                                  |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Τοπική ανάπτυξη με hot reload             |
| `npm run build` | Παραγωγικό build                          |
| `npm start`     | Εκτέλεση του build                        |
| `npm run lint`  | Έλεγχος κώδικα (ESLint + κανόνες React)   |
| `npx tsc --noEmit` | Έλεγχος τύπων TypeScript                |

---

## Σύνδεση με το WordPress

1. Στο `.env.local` ορίστε το REST endpoint:

   ```
   WORDPRESS_API_URL=https://to-site-sas.gr/wp-json/wp/v2
   ```

   Δεν χρειάζεται plugin ούτε κλειδί — το WordPress εκθέτει το REST API από προεπιλογή.
   **Όσο η μεταβλητή είναι κενή, το site δείχνει δείγμα περιεχομένου** και δουλεύει κανονικά.

2. Τα άρθρα ανανεώνονται αυτόματα κάθε `WORDPRESS_REVALIDATE` δευτερόλεπτα (προεπιλογή 300).

3. Για **άμεση** ενημέρωση με κάθε δημοσίευση, ορίστε ένα `REVALIDATE_SECRET` και καλέστε
   από το WordPress:

   ```
   POST https://to-site-sas.gr/api/revalidate?secret=XXX&path=/
   ```

   Snippet για το `functions.php` του θέματος:

   ```php
   add_action('save_post', function ($post_id, $post) {
       if ($post->post_status !== 'publish' || wp_is_post_revision($post_id)) return;
       wp_remote_post('https://to-site-sas.gr/api/revalidate?secret=XXX&path=/', ['blocking' => false]);
   }, 10, 2);
   ```

### Τι διαβάζεται από το WordPress

| Στοιχείο            | Πηγή                                            |
| ------------------- | ----------------------------------------------- |
| 4 τελευταία άρθρα   | `/posts?per_page=4&_embed` (αρχική)             |
| Λίστα νέων          | `/posts?per_page=12&_embed` (`/nea`)            |
| Άρθρο               | `/posts?slug=...` (`/nea/[slug]`)               |
| Σελίδες             | `getPageBySlug()` στο `src/lib/wordpress.ts`    |

Οι εικόνες φορτώνονται με `next/image`. Το hostname του WordPress προστίθεται αυτόματα
στα `images.remotePatterns` του `next.config.ts` από το `WORDPRESS_API_URL`.

---

## Το βίντεο του σχολείου

Το `VideoFeature` δέχεται είτε YouTube είτε τοπικό αρχείο:

```
NEXT_PUBLIC_SCHOOL_VIDEO_ID=abc123XYZ          # YouTube
# ή
NEXT_PUBLIC_SCHOOL_VIDEO_MP4=/video/scholeio.mp4
NEXT_PUBLIC_SCHOOL_VIDEO_POSTER=/video/poster.jpg
```

Χωρίς καμία από τις δύο, εμφανίζεται καλαίσθητο placeholder — το layout δεν αλλάζει.
Το YouTube φορτώνει **μόνο μετά το κλικ** (facade), ώστε να μην επιβαρύνεται η ταχύτητα.

---

## Δομή

```
src/
├─ app/
│  ├─ page.tsx              ΑΡΧΙΚΗ — hero, βίντεο, άρθρα, widgets
│  ├─ layout.tsx            γραμματοσειρές, header/footer, intro
│  ├─ globals.css           design tokens & animations
│  ├─ nea/                  λίστα άρθρων + [slug]
│  ├─ api/revalidate/       webhook για άμεση ανανέωση
│  └─ …                     to-scholeio, tmimata, ekdiloseis, epikoinonia
├─ components/
│  ├─ LoadingScreen.tsx     διαδραστική intro με πιάνο
│  ├─ Hero.tsx  VideoFeature.tsx  PostsPool.tsx  PostCard.tsx
│  ├─ ClockWidget.tsx       αναλογικό ρολόι (αριστερή στήλη)
│  ├─ CalendarWidget.tsx    ημερολόγιο & εκδηλώσεις (δεξιά στήλη)
│  └─ RailCards.tsx  SiteHeader.tsx  SiteFooter.tsx  Reveal.tsx  Logo.tsx
├─ hooks/  useNow.ts, useIntro.ts
└─ lib/    wordpress.ts, site.ts, audio.ts
```

Τα σταθερά στοιχεία (όνομα, τηλέφωνα, μενού, ωράριο) ζουν στο `src/lib/site.ts`.
Οι εκδηλώσεις του ημερολογίου στο `src/components/CalendarWidget.tsx` (`EVENTS`).

---

## Σχεδίαση

Σκούρα «editorial» παλέτα στο πνεύμα κορυφαίων conservatory sites (UNCSA, Manhattan
School of Music): βαθύ μελανί, ορειχάλκινο και κρεμ.

- **Γραμματοσειρές:** EB Garamond (τίτλοι) + Inter (κείμενο) — και οι δύο με πλήρη ελληνικά.
- **Intro:** πιάνο μιας οκτάβας που παίζει πραγματικές νότες με Web Audio API (ποντίκι ή
  πλήκτρα `A S D F G H J K` / `W E T Y U`). Παίζει μία φορά ανά επίσκεψη.
- **Προσβασιμότητα:** σημασιολογικό HTML, `aria-label` παντού, σεβασμός στο
  `prefers-reduced-motion`, πλήρης πλοήγηση με πληκτρολόγιο.
- **Ταχύτητα:** μηδέν εξωτερικές βιβλιοθήκες animation, ISR, facade για το YouTube.
