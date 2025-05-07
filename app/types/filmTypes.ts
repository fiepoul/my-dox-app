// types/filmTypes.ts

// Enkel screening‐post fra backend
export type Schedule = {
  date:    string;
  time:    string;
  cinema:  string;
};

// Gruppe af events (med film‐id) til én timeblok
export type ScheduleBlock = {
  time: string;
  events: {
    /** bruges til at navigere til /movie/{id} */
    id:     number;
    title:  string;
    cinema: string;
  }[];
};

export type Film = {
  id:         number;
  title:      string;
  description:string;
  director:   string;
  duration:   number;
  posterUrl:  string | null;
  year?:      number | null;
  country?:   string | null;
  tagline?:   string | null;
  category?:  string | null;

  /** Backend leverer en liste af screening‐objekter */
  schedules: Schedule[];
};
