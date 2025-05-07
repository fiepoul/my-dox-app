export type ScheduleBlock = {
  time: string;
  events: {
    title: string;
    cinema: string;
  }[];
};

export type Film = {
  id: number;
  title: string;
  description: string;
  director: string;
  duration: number;
  posterUrl: string | null;
  year?: number | null;
  country?: string | null;
  tagline?: string | null;
  category?: string | null;

};

  