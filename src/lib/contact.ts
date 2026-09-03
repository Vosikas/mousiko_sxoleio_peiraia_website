/**
 * Shared between the form and the API route, so the browser and the server
 * agree on what a valid message is. No dependencies.
 */

export const TOPICS = [
  "Εγγραφές & εισαγωγικές εξετάσεις",
  "Γραμματεία",
  "Μουσικά σύνολα & όργανα",
  "Εκδηλώσεις & συνεργασίες",
  "Άλλο",
] as const;

export type Topic = (typeof TOPICS)[number];

export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
  /** honeypot — must stay empty */
  website?: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const EMPTY_CONTACT: ContactInput = {
  name: "",
  email: "",
  phone: "",
  topic: TOPICS[0],
  message: "",
  consent: false,
  website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE = /^[0-9+()\s.-]{8,20}$/;

export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};

  const name = input.name.trim();
  if (name.length < 2) errors.name = "Συμπληρώστε το ονοματεπώνυμό σας.";
  else if (name.length > 80) errors.name = "Το όνομα είναι πολύ μεγάλο.";

  const email = input.email.trim();
  if (!email) errors.email = "Χρειαζόμαστε ένα email για να απαντήσουμε.";
  else if (!EMAIL.test(email) || email.length > 120) errors.email = "Ελέγξτε τη διεύθυνση email.";

  const phone = input.phone.trim();
  if (phone && !PHONE.test(phone)) errors.phone = "Ελέγξτε τον αριθμό τηλεφώνου.";

  if (!TOPICS.includes(input.topic as Topic)) errors.topic = "Επιλέξτε θέμα.";

  const message = input.message.trim();
  if (message.length < 10) errors.message = "Γράψτε λίγο περισσότερα, τουλάχιστον 10 χαρακτήρες.";
  else if (message.length > 4000) errors.message = "Το μήνυμα ξεπερνά τους 4.000 χαρακτήρες.";

  if (!input.consent) errors.consent = "Χρειαζόμαστε τη συγκατάθεσή σας για να απαντήσουμε.";

  return errors;
}

export const hasErrors = (errors: ContactErrors) => Object.keys(errors).length > 0;
