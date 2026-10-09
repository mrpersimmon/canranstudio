// Run through the supported CUA tab, after enabling “翻页动画”.
// The animation stays at its real speed; this reads rendered styles, never app state.
export function readAppearance() {
  const book = document.querySelector('.book');
  const art = document.querySelector('.book-art');
  const material = art?.getAttribute('src');
  const read = selector => Array.from(document.querySelectorAll(selector)).map(element => {
    const style = getComputedStyle(element);
    return {
      opacity: Number(style.opacity),
      transform: style.transform,
      background: style.backgroundColor,
      bookMaterial: Boolean(material && style.backgroundImage.includes(material)),
      disabled: element.disabled,
      text: element.textContent?.trim(),
    };
  });
  return {
    busy: book?.getAttribute('aria-busy') === 'true',
    animated: book?.getAttribute('data-motion') === 'full',
    mobile: book?.classList.contains('is-mobile'),
    faces: read('.leaf-face'),
    sheets: read('.mobile-sheet, .mobile-turning-leaf, .turning-leaf'),
    buttons: read('.pagination button'),
    page: document.querySelector('.page-count')?.textContent,
  };
}

export async function checkTurnColors(tab, direction, capture) {
  const before = await tab.playwright.evaluate(readAppearance);
  if (!before.animated || before.busy) throw Error('Open a settled book with animation enabled.');
  const label = direction > 0 ? '下一页' : '上一页';
  const control = tab.playwright.getByRole('button', { name: label, exact: true });
  if (!(await control.isEnabled())) throw Error(`${label} is at the book boundary.`);
  // Keyboard activation keeps pointer hover from being mistaken for a color flash.
  await control.press('Enter');
  const samples = [];
  const deadline = Date.now() + 1800;
  while (Date.now() < deadline && samples.length < 180) {
    const frame = await tab.playwright.evaluate(readAppearance);
    samples.push(frame);
    if (capture && samples.length === 5 && frame.busy) await capture();
    if (!frame.busy && samples.some(item => item.busy)) break;
  }
  const during = samples.filter(frame => frame.busy);
  const failures = [];
  if (!during.length) failures.push('No animation frame was sampled; verification is inconclusive.');
  const rotations = new Set(during.flatMap(frame => frame.sheets.map(sheet => sheet.transform)).filter(value => value !== 'none'));
  if (rotations.size < 2) failures.push('The turning sheet did not visibly rotate across sampled frames.');
  if (during.some(frame => [...frame.sheets, ...frame.faces].some(sheet => sheet.opacity !== 1))) failures.push('The turning sheet fades and changes the card colors.');
  if (during.some(frame => frame.faces.some(face => !face.bookMaterial))) failures.push('The turning page replaces the original book paper.');
  if (during.some(frame => frame.buttons.some((button, index) => button.background !== before.buttons[index].background))) failures.push('A navigation button changes color while the page is turning.');
  const after = samples.at(-1);
  if (after.busy || after.page === before.page) failures.push('The turn did not settle on a new page.');
  return { passed: failures.length === 0, failures, before, samples, after };
}
