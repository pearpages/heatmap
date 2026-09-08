import type { HeatmapLabels } from '@pearpages/heatmap';

type Language = 'en' | 'ca';

interface Dictionary {
  // The locale string handed to the component, which drives Intl.
  locale: string;
  // Catalonia, like most of Europe, starts the week on Monday.
  weekStartsOn: number;
  labels: HeatmapLabels;

  tagline: string;
  intro: string;
  install: string;
  language: string;
  appearance: string;
  theme: string;
  auto: string;
  light: string;
  dark: string;

  calendarTitle: string;
  calendarBody: string;
  monthTitle: string;
  monthBody: string;
  usage: string;
}

const en: Dictionary = {
  // en-US rather than en-GB: en-GB abbreviates September as "Sept", which is a
  // character wider than every other month.
  locale: 'en-US',
  weekStartsOn: 0,
  labels: {
    less: 'Less',
    more: 'More',
    level: (level) => `Level ${level}`,
    noContributions: 'No contributions',
    contributions: (count) => `${count} contribution${count === 1 ? '' : 's'}`,
  },

  tagline: 'A GitHub-style contribution heatmap for React 19.',
  intro:
    'Two layouts, four colour themes, light and dark, and any language Intl knows. ' +
    'The component ships no translations: it derives day and month names from the ' +
    'locale you give it, and takes the handful of strings Intl cannot derive as props.',
  install: 'Install',
  language: 'Language',
  appearance: 'Appearance',
  theme: 'Theme',
  auto: 'Auto',
  light: 'Light',
  dark: 'Dark',

  calendarTitle: 'Contribution calendar',
  calendarBody:
    'A year at a glance: one column per week, one row per weekday. This is the layout ' +
    'GitHub uses on a profile. The squares keep their size and the grid scrolls ' +
    'sideways when the period does not fit.',
  monthTitle: 'Month grid',
  monthBody:
    'The same data transposed: one row per week, one column per weekday, which is the ' +
    'shape of a date picker. It suits short periods, where a year-wide strip would be ' +
    'mostly empty. Below 480px it fills the width instead of hugging its grid.',
  usage: 'Usage',
};

const ca: Dictionary = {
  locale: 'ca',
  weekStartsOn: 1,
  labels: {
    less: 'Menys',
    more: 'Més',
    level: (level) => `Nivell ${level}`,
    noContributions: 'Cap contribució',
    contributions: (count) =>
      count === 1 ? '1 contribució' : `${count} contribucions`,
  },

  tagline: "Un mapa de calor de contribucions a l'estil de GitHub per a React 19.",
  intro:
    'Dues disposicions, quatre temes de color, mode clar i fosc, i qualsevol idioma ' +
    'que Intl conegui. El component no inclou cap traducció: dedueix els noms dels ' +
    "dies i dels mesos de l'idioma que li passes, i rep com a propietats les poques " +
    'cadenes que Intl no pot deduir.',
  install: 'Instal·lació',
  language: 'Idioma',
  appearance: 'Aparença',
  theme: 'Tema',
  auto: 'Automàtic',
  light: 'Clar',
  dark: 'Fosc',

  calendarTitle: 'Calendari de contribucions',
  calendarBody:
    "Un any d'un cop d'ull: una columna per setmana i una fila per dia de la setmana. " +
    'És la disposició que fa servir GitHub als perfils. Els quadrats conserven la mida ' +
    'i la graella es desplaça horitzontalment quan el període no hi cap.',
  monthTitle: 'Graella mensual',
  monthBody:
    'Les mateixes dades transposades: una fila per setmana i una columna per dia de la ' +
    "setmana, la forma d'un selector de dates. Va bé per a períodes curts, on una tira " +
    "d'un any quedaria gairebé buida. Per sota de 480px omple l'amplada disponible.",
  usage: 'Ús',
};

const dictionaries: Record<Language, Dictionary> = { en, ca };

export { dictionaries };
export type { Language, Dictionary };
