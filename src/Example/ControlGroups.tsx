import './controlGroups.scss';
import type { Theme } from '@/shared/models';

export function ControlGroups({
  actions: { theme, setTheme, hasRealisticData, setHasRealisticData },
}: {
  actions: {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    hasRealisticData: boolean;
    setHasRealisticData: (use: boolean) => void;
  };
}) {
  return (
    <>
      <div className="control-group">
        <label className="control-group__label">Theme:</label>
        <div className="control-group__buttons">
          <button
            className={`theme-button ${theme === '' ? 'theme-button--active' : ''}`}
            onClick={() => setTheme('')}
          >
            GitHub
          </button>
          <button
            className={`theme-button ${theme === 'ocean' ? 'theme-button--active' : ''}`}
            onClick={() => setTheme('ocean')}
          >
            Ocean
          </button>
          <button
            className={`theme-button ${theme === 'sunset' ? 'theme-button--active' : ''}`}
            onClick={() => setTheme('sunset')}
          >
            Sunset
          </button>
          <button
            className={`theme-button ${theme === 'purple' ? 'theme-button--active' : ''}`}
            onClick={() => setTheme('purple')}
          >
            Purple
          </button>
        </div>
      </div>
      <div className="control-group">
        <label className="control-group__checkbox">
          <input
            type="checkbox"
            checked={hasRealisticData}
            onChange={(e) => setHasRealisticData(e.target.checked)}
          />
          Use realistic sample data
        </label>
      </div>
    </>
  );
}
