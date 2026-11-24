(function (root) {
  'use strict';
  const core = root.CanranCore;
  function create({ unit, practice, onChange, onAward = () => {} }) {
    const { edition, zones } = unit.reward;
    const key = unit.progress.learningKey + ':awards:' + edition;
    let access = root.CanranStudentAccess;
    /* @bench:award-session */
    let ledger = { edition, zones: {}, firstFullStarAt: null, rejected: {} };
    const unsaved = new Set();
    let claims = practice.activity('unitAwardClaims') || {};
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved?.edition === edition && saved.zones && typeof saved.zones === 'object') ledger = saved;
    } catch { /* The current round can still earn a reward when storage recovers. */ }
    ledger.rejected ||= {};
    // The server owns confirmed awards/dates. A durable, locally validated
    // claim can provide immediate feedback while that same proof is synced.
    if (access && !access.preview) ledger = { ...ledger, edition,
      zones: access.awards?.edition === edition ? { ...access.awards.zones } : {},
      firstFullStarAt: access.awards?.edition === edition ? access.awards.firstFullStarAt || null : null };
    claims = Object.fromEntries(Object.entries(claims).filter(([id, claim]) => core.awardRules.validClaim(unit, id, claim)));
    for(const review of access?.awardReviews || [])if(!review.accepted && review.edition===edition && claims[review.zone]?.runId===review.runId)ledger.rejected[review.zone]={runId:review.runId,reason:review.reason};
    for (const [id, claim] of Object.entries(claims)) {
      if (ledger.zones[id] && !ledger.zones[id].pending) delete ledger.rejected[id];
      else if (ledger.rejected[id]?.runId !== claim.runId) ledger.zones[id] = { runId: claim.runId, pending: Boolean(access && !access.preview) };
    }

    function state() {
      const visible = Object.fromEntries(zones.filter(zone => ledger.zones[zone.id] &&
        (!ledger.zones[zone.id].pending || claims[zone.id] && ledger.rejected[zone.id]?.runId !== claims[zone.id].runId)).map(zone => [zone.id, ledger.zones[zone.id]]));
      const confirmedZones = Object.fromEntries(Object.entries(visible).filter(([,value]) => !value.pending));
      const pendingZones = Object.keys(visible).filter(id => visible[id].pending);
      const rejectedZones = zones.filter(zone => !confirmedZones[zone.id] && ledger.rejected[zone.id]?.runId === claims[zone.id]?.runId && claims[zone.id]).map(zone => zone.id);
      const rejectionMessages = Object.fromEntries(rejectedZones.map(id => [id, ledger.rejected[id].reason === 'version'
        ? '课程版本已更新，请重新完成本轮。' : ledger.rejected[id].reason === 'access' ? '学习身份需重新核验，作答记录已保留。' : '本轮得星未获确认，作答记录已保留。']));
      return { edition, zones: visible, pendingZones, stars: Object.keys(visible).length,
        confirmedZones, confirmedStars: Object.keys(confirmedZones).length, rejectedZones, rejectionMessages,
        unsavedZones: [...unsaved], firstFullStarAt: ledger.firstFullStarAt };
    }
    function save() {
      if (state().stars === 5 && !ledger.firstFullStarAt && (!access || access.preview)) ledger.firstFullStarAt = new Date().toISOString();
      try { localStorage.setItem(key, JSON.stringify(ledger)); } catch { /* Practice save warning owns persistence feedback. */ }
      onChange(state());
      root.dispatchEvent(new root.CustomEvent('lesson-awards:local-state', { detail: { unitId: unit.id, state: state() } }));
    }
    function record(id, states, round) {
      const claim = { edition, ...round, states: structuredClone(states) };
      if (!core.awardRules.validClaim(unit, id, claim)) return false;
      // Preserve the first qualifying round independently from later replays.
      if (!ledger.zones[id] && ledger.rejected[id]?.runId !== claim.runId) {
        const before = state();
        claims = { ...claims, [id]: claim }; practice.activity('unitAwardClaims', claims);
        // Practice can keep an in-memory answer after a quota/write failure.
        // A visual local award must be backed by the actual saved notebook.
        let durable = false;
        try { const saved = JSON.parse(localStorage.getItem(unit.progress.learningKey))?.activity?.unitAwardClaims?.[id];
          durable = saved?.runId === claim.runId && core.awardRules.validClaim(unit, id, saved); } catch {}
        if (!durable) { unsaved.add(id); save(); return true; }
        unsaved.delete(id); delete ledger.rejected[id];
        ledger.zones[id] = { runId: round.runId, pending: Boolean(access && !access.preview) };
        save(); onAward({ before, state: state(), zoneIds: [id] });
      }
      return true;
    }
    root.addEventListener('lesson-awards:synced', event => {
      const canonical = event.detail;
      if (!canonical) return;
      // A response acknowledges only claims present in that request. An older
      // in-flight response cannot erase a newer local round or another zone.
      for (const review of canonical.reviews || []) {
        if (review.edition !== edition || claims[review.zone]?.runId !== review.runId || review.accepted) continue;
        if (ledger.zones[review.zone] && !ledger.zones[review.zone].pending) continue;
        ledger.rejected[review.zone] = { runId: review.runId, reason: review.reason };
        delete ledger.zones[review.zone];
      }
      if (canonical.edition === edition) {
        ledger.zones = { ...ledger.zones, ...canonical.zones };
        for (const id of Object.keys(canonical.zones || {})) { delete ledger.rejected[id]; unsaved.delete(id); }
        if (canonical.firstFullStarAt) ledger.firstFullStarAt = canonical.firstFullStarAt;
      }
      save();
      // Local completion already owns the flight. Confirmation only reconciles
      // status and dates, including after refresh or navigation.
    });
    save();
    /* @bench:award-ready */
    return { record, state };
  }
  core.unitAwards = { create };
})(globalThis);
