import { useEffect, useState } from 'react';

const STORAGE_KEY = 'fds-cookie-consent';

const DEFAULT_PREFS = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(prefs) {
  const payload = {
    ...prefs,
    necessary: true,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent('fds-cookie-consent', { detail: payload }));
  return payload;
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event('fds-open-cookie-preferences'));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setPrefs({
        necessary: true,
        analytics: !!existing.analytics,
        marketing: !!existing.marketing,
      });
    }

    const open = () => {
      const current = readConsent();
      if (current) {
        setPrefs({
          necessary: true,
          analytics: !!current.analytics,
          marketing: !!current.marketing,
        });
      }
      setCustomizing(true);
      setVisible(true);
    };

    window.addEventListener('fds-open-cookie-preferences', open);
    return () => window.removeEventListener('fds-open-cookie-preferences', open);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setCustomizing(false);
  };

  const acceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    dismiss();
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    dismiss();
  };

  const saveCustom = () => {
    saveConsent(prefs);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed z-[60] bottom-20 left-4 right-4 sm:right-auto sm:w-[380px]
        md:bottom-6 md:left-6"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-modal="false"
    >
      <div className="bg-white shadow-[0_12px_40px_rgba(11,26,18,0.18)] border border-forest-100
        p-6 sm:p-7 animate-fade-up">
        {!customizing ? (
          <>
            <h2 id="cookie-consent-title"
              className="font-serif text-2xl font-semibold text-forest-700 mb-3">
              We value your privacy
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              We use cookies to enhance your browsing experience, serve personalized ads
              or content, and analyze our traffic. By clicking &ldquo;Accept All&rdquo;, you consent
              to our use of cookies.
            </p>

            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className="text-sm font-medium italic text-forest-500 hover:text-forest-700
                  transition-colors underline-offset-2 hover:underline"
              >
                Customize
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="text-sm font-medium italic text-forest-500 hover:text-forest-700
                  transition-colors underline-offset-2 hover:underline"
              >
                Reject All
              </button>
            </div>

            <button
              type="button"
              onClick={acceptAll}
              className="w-full bg-forest-600 text-white py-3.5 text-base font-serif italic
                font-medium tracking-wide hover:bg-forest-500 transition-colors"
            >
              Accept All
            </button>
          </>
        ) : (
          <>
            <h2 id="cookie-consent-title"
              className="font-serif text-2xl font-semibold text-forest-700 mb-2">
              Cookie preferences
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Choose which cookies you allow. Necessary cookies are always on.
            </p>

            <div className="space-y-4 mb-6">
              <PreferenceRow
                title="Necessary"
                description="Required for the site to work properly."
                checked
                locked
              />
              <PreferenceRow
                title="Analytics"
                description="Help us understand how visitors use the site."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <PreferenceRow
                title="Marketing"
                description="Used for personalized ads and content."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="flex-1 border border-forest-200 text-forest-600 py-3 text-sm
                  font-display font-semibold uppercase tracking-wider
                  hover:border-forest-400 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={saveCustom}
                className="flex-1 bg-forest-600 text-white py-3 text-sm
                  font-display font-semibold uppercase tracking-wider
                  hover:bg-forest-500 transition-colors"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PreferenceRow({ title, description, checked, onChange, locked }) {
  return (
    <label className={`flex items-start justify-between gap-4 ${locked ? '' : 'cursor-pointer'}`}>
      <div>
        <div className="text-sm font-semibold text-forest-700">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</div>
      </div>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-forest-600"
        checked={checked}
        disabled={locked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
    </label>
  );
}
