/* Small helpers shared by every page. */

// copy-to-clipboard buttons: <button data-copy="text">
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const label = btn.querySelector('span');
  const before = label ? label.textContent : '';
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    btn.classList.add('is-copied');
    if (label) label.textContent = 'Copied';
  } catch {
    if (label) label.textContent = 'Copy failed: select it from the page';
  }
  setTimeout(() => { btn.classList.remove('is-copied'); if (label) label.textContent = before; }, 1800);
});
