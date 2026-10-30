export type Keepsake = { id: string; chapterId: string; start: number; end: number; label: string; title: string; image: string; stars: number; firstFullStarAt: string; sha256: string };
export type Chapter = { id: string; name: string; label: string; letter: string; cardIds: string[] };
// Original preview exports: dates, stars and identity are not inferred from UI state.
export const keepsakes: Keepsake[] = [
  { id: 'unit1-2', chapterId: 'opening', start: 1, end: 2, label: 'Lesson 1–2', title: '礼貌小帮手', image: '/art/unit1-2.gif', stars: 5, firstFullStarAt: '2026.10.16', sha256: '05a0665cce4583067edce2c6d9942c044d142c60d07e2e8c7d6e876d3f326950' },
  { id: 'unit3-4', chapterId: 'opening', start: 3, end: 4, label: 'Lesson 3–4', title: '认领小达人', image: '/art/unit3-4.gif', stars: 5, firstFullStarAt: '2026.10.16', sha256: 'd2d463f2b40f46b78582267ec8306e7f090deb6e4d6bda4b845e9cf936b4be74' },
  { id: 'unit5-6', chapterId: 'opening', start: 5, end: 6, label: 'Lesson 5–6', title: '新朋友小使者', image: '/art/unit5-6.gif', stars: 5, firstFullStarAt: '2026.10.16', sha256: 'cb43a2ef9b2fbc5d954bfa97de456e8deac60c47f4a7f3375a1c2cf7cc556277' },
  { id: 'unit7-8', chapterId: 'neighborhood', start: 7, end: 8, label: 'Lesson 7–8', title: '新朋友小记者', image: '/art/unit7-8.gif', stars: 5, firstFullStarAt: '2026.10.22', sha256: 'b4d1d9ecdffe5a8a403cd0082f3bd45495a80bca4d85d7200ab6a4a700e64a0d' },
  { id: 'unit9-10', chapterId: 'neighborhood', start: 9, end: 10, label: 'Lesson 9–10', title: '暖心问候小伙伴', image: '/art/unit9-10.gif', stars: 5, firstFullStarAt: '2026.10.22', sha256: '3512ff3c9597ec9a3842a19d984813a1a4b8c39af92fc6802d3cc6d586fa46cf' },
  { id: 'unit11-12', chapterId: 'neighborhood', start: 11, end: 12, label: 'Lesson 11–12', title: '归还物品小能手', image: '/art/unit11-12.gif', stars: 5, firstFullStarAt: '2026.10.22', sha256: '575723862bfb9cd52fa94728d065b924cea9018e523a1489fc27e9c95cdbcc73' },
];
export const chapters: Chapter[] = [
  { id: 'opening', name: '初识小镇', label: 'Lesson 1–6', letter: '第一封信', cardIds: ['unit1-2', 'unit3-4', 'unit5-6'] },
  { id: 'neighborhood', name: '邻里来信', label: 'Lesson 7–12', letter: '第二封信', cardIds: ['unit7-8', 'unit9-10', 'unit11-12'] },
];
export const collectionLabel = `Lesson ${Math.min(...keepsakes.map(card => card.start))}–${Math.max(...keepsakes.map(card => card.end))}`;
export function chapterForCard(id: string): Chapter {
  const chapter = chapters.find(item => item.cardIds.includes(id));
  if (!chapter) throw new Error(`Unknown keepsake: ${id}`);
  return chapter;
}
export function cardsInChapter(chapterId: string): Keepsake[] {
  const chapter = chapters.find(item => item.id === chapterId);
  return chapter ? chapter.cardIds.map(id => keepsakes.find(card => card.id === id)!) : [];
}
export function restoreChapterCard(chapterId: string, remembered?: string): Keepsake | null {
  const cards = cardsInChapter(chapterId);
  return cards.find(card => card.id === remembered) ?? cards[0] ?? null;
}
export function normalizeQuery(query: string): string {
  return query.normalize('NFKC').trim().toLowerCase().replace(/[–—−~～至到]/g, '-').replace(/\s+/g, '').replace(/^lessons?/, '').replace(/^第/, '').replace(/课$/, '');
}
export function searchKeepsakes(cards: Keepsake[], query: string): Keepsake[] {
  const term = normalizeQuery(query);
  if (!term) return cards;
  if (/^\d+$/.test(term)) return cards.filter(card => Number(term) >= card.start && Number(term) <= card.end);
  const range = term.match(/^(\d+)-(\d+)$/);
  if (range) {
    const start = Number(range[1]), end = Number(range[2]);
    return start > end ? [] : cards.filter(card => card.start <= end && card.end >= start);
  }
  return cards.filter(card => normalizeQuery(`${card.title} ${card.label}`).includes(term));
}
export function isOutsideDemo(query: string): boolean {
  const numeric = normalizeQuery(query).match(/^(\d+)(?:-(\d+))?$/);
  if (!numeric) return false;
  const start = Number(numeric[1]), end = Number(numeric[2] ?? numeric[1]);
  return start <= end && !keepsakes.some(card => card.start <= end && card.end >= start);
}
