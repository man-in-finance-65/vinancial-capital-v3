declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let loadPromise: Promise<void> | null = null;

export function loadRecaptcha(siteKey: string): Promise<void> {
  if (!siteKey) return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export async function getRecaptchaToken(siteKey: string): Promise<string> {
  if (!siteKey) return '';
  try {
    await loadRecaptcha(siteKey);
    if (!window.grecaptcha) return '';
    return await new Promise<string>((resolve) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(siteKey, { action: 'submit' })
          .then(resolve)
          .catch(() => resolve(''));
      });
    });
  } catch {
    return '';
  }
}
