import { useEffect, useMemo, useState } from "react";
import {
  ContributionHeatmap,
  generateMockData,
  getLastMonthPeriod,
  getLastYearPeriod,
  groupByWeeks,
  type Theme,
} from "@pearpages/heatmap";
import pkg from "../../package.json";
import { dictionaries, type Language } from "./i18n";
import "./app.scss";

type Scheme = "auto" | "light" | "dark";

const THEMES: { value: Theme; label: string }[] = [
  { value: "", label: "GitHub" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
  { value: "purple", label: "Purple" },
];

// Built once: the mock generator is random, so regenerating on every render would
// reshuffle the grid every time a switcher is touched.
const yearPeriod = getLastYearPeriod();
const monthPeriod = getLastMonthPeriod();
const yearData = generateMockData({ period: yearPeriod, isRealistic: true });
const monthData = generateMockData({ period: monthPeriod, isRealistic: true });

function Choice<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="choice">
      <legend className="choice__legend">{legend}</legend>
      <div className="choice__options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`choice__option${
              option.value === value ? " choice__option--active" : ""
            }`}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="code">
      <code>{children}</code>
    </pre>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [scheme, setScheme] = useState<Scheme>("auto");
  const [theme, setTheme] = useState<Theme>("");

  const t = dictionaries[language];

  // Mirror the switcher onto <html> so the page chrome follows it too, not just the
  // widgets. Auto removes the attribute rather than setting data-theme="auto": that
  // would match neither selector in app.scss and strand the page on the light palette.
  useEffect(() => {
    const root = document.documentElement;
    if (scheme === "auto") root.removeAttribute("data-theme");
    else root.dataset.theme = scheme;
  }, [scheme]);

  // index.html hardcodes lang="en", which is wrong half the time now and is what a
  // screen reader uses to pronounce the Catalan text.
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Rebuilt when the language changes, because the week no longer starts on the
  // same day: Catalan weeks run Monday to Sunday.
  const yearWeeks = useMemo(
    () => groupByWeeks(yearData, { weekStartsOn: t.weekStartsOn }),
    [t.weekStartsOn],
  );
  const monthWeeks = useMemo(
    () => groupByWeeks(monthData, { weekStartsOn: t.weekStartsOn }),
    [t.weekStartsOn],
  );

  const className = [
    scheme === "auto" ? "" : `contribution-heatmap--${scheme}`,
    theme ? `contribution-heatmap--${theme}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  // The samples mirror the switchers above, so what is on the page is always what
  // the code next to it would produce.
  const classNameSample = className ? `\n  className="${className}"` : "";
  const localeSample =
    language === "en"
      ? ""
      : `\n  locale="${t.locale}"\n  labels={{ less: '${t.labels.less}', more: '${t.labels.more}' }}`;

  const calendarSample = `import { ContributionHeatmap, generateMockData, getLastYearPeriod, groupByWeeks } from '@pearpages/heatmap';
import '@pearpages/heatmap/styles.css';

const period = getLastYearPeriod();
const contribution = generateMockData({ period, isRealistic: true });

<ContributionHeatmap
  data={{ contribution, period, weeks: groupByWeeks(contribution, { weekStartsOn: ${t.weekStartsOn} }) }}${localeSample}${classNameSample}
/>`;

  const monthSample = `import { ContributionHeatmap, getLastMonthPeriod, groupByWeeks } from '@pearpages/heatmap';

const period = getLastMonthPeriod();

<ContributionHeatmap
  isReverse
  data={{ contribution, period, weeks: groupByWeeks(contribution, { weekStartsOn: ${t.weekStartsOn} }) }}${localeSample}${classNameSample}
/>`;

  return (
    <>
      <nav className="nav">
        <div className="nav__inner">
          <span className="nav__brand">
            @pearpages/heatmap{" "}
            <span className="nav__version">v{pkg.version}</span>
          </span>
          <div className="nav__switchers">
            <Choice
              legend={t.language}
              value={language}
              options={[
                { value: "en", label: "English" },
                { value: "ca", label: "Català" },
              ]}
              onChange={setLanguage}
            />
            <Choice
              legend={t.appearance}
              value={scheme}
              options={[
                { value: "auto", label: t.auto },
                { value: "light", label: t.light },
                { value: "dark", label: t.dark },
              ]}
              onChange={setScheme}
            />
          </div>
        </div>
      </nav>

      <div className="page">
        <header className="page__header">
          <p className="page__tagline">{t.tagline}</p>
          <p className="page__intro">{t.intro}</p>
          <h2 className="page__subheading">{t.install}</h2>
          <Code>{`npm install @pearpages/heatmap`}</Code>
        </header>

        <div className="page__controls">
          <Choice
            legend={t.theme}
            value={theme}
            options={THEMES}
            onChange={setTheme}
          />
        </div>

        <section className="section">
          <h2 className="section__title">{t.calendarTitle}</h2>
          <p className="section__body">{t.calendarBody}</p>
          <div className="section__demo">
            <ContributionHeatmap
              className={className}
              locale={t.locale}
              labels={t.labels}
              data={{
                contribution: yearData,
                period: yearPeriod,
                weeks: yearWeeks,
              }}
            />
          </div>
          <h3 className="section__usage">{t.usage}</h3>
          <Code>{calendarSample}</Code>
        </section>

        <section className="section">
          <h2 className="section__title">{t.monthTitle}</h2>
          <p className="section__body">{t.monthBody}</p>
          <div className="section__demo">
            <ContributionHeatmap
              isReverse
              className={className}
              locale={t.locale}
              labels={t.labels}
              data={{
                contribution: monthData,
                period: monthPeriod,
                weeks: monthWeeks,
              }}
            />
          </div>
          <h3 className="section__usage">{t.usage}</h3>
          <Code>{monthSample}</Code>
        </section>

        <footer className="page__footer">
          <a href="https://github.com/pearpages/heatmap">GitHub</a>
          <a href="https://www.npmjs.com/package/@pearpages/heatmap">npm</a>
        </footer>
      </div>
    </>
  );
}

export default App;
