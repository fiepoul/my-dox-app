import type { Film } from "../types/filmTypes";

const API_URL = 'http://192.168.2.7:8080/api/films';

export async function fetchDoxFilms(): Promise<Film[]> {
  const response = await fetch(API_URL); 
  if (!response.ok) throw new Error('Fejl ved hentning af Dox-data');
  return response.json();
}
