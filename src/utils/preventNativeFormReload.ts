/**
 * Stops accidental full-page reloads from native HTML form submission.
 * React handlers (e.g. login onSubmit) still run; only the browser navigation is blocked.
 */
export function installPreventNativeFormReload(): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
    },
    true,
  );
}
