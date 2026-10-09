(function (root) {
  'use strict';
  const core = root.CanranCore;
  function create({ unit, practice, onChange }) {
    const { edition, zones } = unit.reward;
    const key = unit.progress.learningKey + ':awards:' + edition;
    const access = root.CanranStudentAccess;
    let ledger = { edition, zones: {}, firstFullStarAt: null };
    let claims = practice.activity('unitAwardClaims') || {};
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved?.edition === edition && saved.zones && typeof saved.zones === 'object') ledger = saved;
    } catch { /* The current round can still earn a reward when storage recovers. */ }
    // The signed-in server is authoritative. Local completed claims may still
    // be pending, but a device's clock never fixes the account's full-star date.
    if (access && !access.preview) ledger = { edition, zones: { ...access.awards?.zones }, firstFullStarAt: access.awards?.firstFullStarAt || null };
    claims = Object.fromEntries(Object.entries(claims).filter(([id, claim]) => core.awardRules.validClaim(unit, id, claim)));
    for (const id of Object.keys(claims)) ledger.zones[id] ||= { pending: Boolean(access && !access.preview) };

    function state() {
      const earned = Object.fromEntries(zones.filter(zone => ledger.zones[zone.id] && !ledger.zones[zone.id].pending).map(zone => [zone.id, ledger.zones[zone.id]]));
      const pendingZones = zones.filter(zone => ledger.zones[zone.id]?.pending).map(zone => zone.id);
      return { edition, zones: earned, pendingZones, stars: Object.keys(earned).length, firstFullStarAt: ledger.firstFullStarAt };
    }
    function save() {
      if (state().stars === 5 && !ledger.firstFullStarAt && (!access || access.preview)) ledger.firstFullStarAt = new Date().toISOString();
      try { localStorage.setItem(key, JSON.stringify(ledger)); } catch { /* Practice save warning owns persistence feedback. */ }
      onChange(state());
    }
    function record(id, states, round) {
      const claim = { edition, ...round, states: structuredClone(states) };
      if (!core.awardRules.validClaim(unit, id, claim)) return false;
      // Preserve the first qualifying round independently from later replays.
      if (!claims[id] && !ledger.zones[id]) {
        claims[id] = claim; ledger.zones[id] = { runId: round.runId, pending: Boolean(access && !access.preview) };
        save(); practice.activity('unitAwardClaims', claims);
      }
      return true;
    }
    root.addEventListener('lesson-awards:synced', event => {
      const canonical = event.detail;
      if (canonical?.edition !== edition) return;
      ledger.zones = { ...ledger.zones, ...canonical.zones };
      if (canonical.firstFullStarAt) ledger.firstFullStarAt = canonical.firstFullStarAt;
      save();
    });
    save(); return { record, state };
  }
  core.unitAwards = { create };
})(globalThis);
