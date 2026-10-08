"use strict";

const fs = require("fs");
const path = require("path");
const model = require("../demo/update-model.js");

const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "demo", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

const results = [];

function check(name, fn) {
  try {
    fn();
    results.push({ name: name, ok: true });
  } catch (error) {
    results.push({
      name: name,
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sameDurable(before, state) {
  assert(
    JSON.stringify(model.durableState(state)) === JSON.stringify(before),
    "memory, conversation, or routine schedule changed"
  );
}

function release(version, changelog, fields, patch) {
  const next = {
    name: fields.name,
    instructions: fields.instructions,
    routines: fields.routines,
    skills: fields.skills,
  };
  Object.keys(patch).forEach(function (key) {
    next[key] = patch[key];
  });
  return { version: version, changelog: changelog, fields: next };
}

check("page banner states the live fail and that the draft does not clear it", function () {
  assert(html.includes("Live grade: FAIL"), "missing live grade");
  assert(
    html.includes("draft simulation, does not clear the fail"),
    "missing draft disclaimer"
  );
  assert(!/fetch\s*\(/.test(html), "demo must not call fetch");
  assert(!html.includes("grokbot://"), "demo must not deep-link an install");
  assert(html.includes("Keep mine"), "missing keep-mine choice");
  assert(html.includes("Take template"), "missing take-template choice");
  assert(html.includes("Roll back"), "missing rollback");
  assert(html.includes("Auto-update"), "missing auto-update opt-in");
});

check("installed copy shows template name and version", function () {
  const state = model.createSimulation();
  const info = model.badge(state);
  assert(
    info.text === "From template Dr Eggbot, version v0.2.0",
    "badge text was " + info.text
  );
  assert(info.newer === false, "a fresh install should not already be behind");
  assert(state.autoUpdate === false, "auto-update must default off");
});

check("auto-update off: one notice per new version, then one-click update", function () {
  const state = model.createSimulation();
  const durable = model.durableState(state);
  const next = release(state.installedVersion && "v0.3.0", "Offers the transcript skim once, on first run.", state.fields, {
    instructions: state.fields.instructions + " Offer the transcript skim once, on first run.",
    skills: state.fields.skills + " First-run skim offer.",
  });
  model.publishVersion(state, next);
  assert(state.installedVersion === "v0.2.0", "publish must leave the installed pin in place");
  assert(state.fields.instructions.indexOf("Offer the transcript skim") === -1, "publish must not change installed fields");
  assert(model.badge(state).newer === true, "badge should say a newer version exists");
  assert(state.notices.length === 1, "expected one notice, got " + state.notices.length);
  assert(state.notices[0].type === "available", "notice should be update available");
  assert(state.notices[0].version === "v0.3.0", "notice should name the new version");
  assert(state.notices[0].changelog.indexOf("transcript skim") !== -1, "notice should include the changelog");

  model.runBot(state);
  model.runBot(state);
  model.runBot(state);
  assert(state.notices.length === 1, "running the bot must not add another notice");
  assert(state.runCount === 3, "runs should still be counted");

  const result = model.applyUpdate(state, {});
  assert(result.applied === true, "one-click update should apply");
  assert(state.installedVersion === "v0.3.0", "install should move to the new version");
  assert(state.fields.skills.indexOf("First-run skim offer.") !== -1, "untouched skill text should update");
  assert(state.notices.length === 1, "update should leave one notice");
  assert(state.notices[0].type === "applied", "the remaining notice should say what changed");
  model.runBot(state);
  assert(state.notices.length === 1, "a later run must not repeat the notice");
  sameDurable(durable, state);
});

check("opting in applies a waiting version once; later versions apply with one notice", function () {
  const state = model.createSimulation();
  const durable = model.durableState(state);
  model.publishVersion(
    state,
    release("v0.3.0", "Offers the transcript skim once, on first run.", state.fields, {
      skills: state.fields.skills + " First-run skim offer.",
    })
  );
  assert(state.notices.length === 1 && state.notices[0].type === "available", "default path is a single available notice");
  model.setAutoUpdate(state, true);
  assert(state.autoUpdate === true, "opt-in should stick");
  assert(state.installedVersion === "v0.3.0", "opting in should apply the waiting version");
  assert(state.notices.length === 1, "opt-in apply should leave exactly one notice");
  assert(state.notices[0].type === "applied", "opt-in notice should describe the apply");

  model.publishVersion(
    state,
    release("v0.4.0", "Tightens the Monday checkup wording.", state.fields, {
      routines: state.fields.routines + " Monday checkup stays a report, not a delete.",
    })
  );
  assert(state.installedVersion === "v0.4.0", "auto-update should apply the next version");
  assert(state.notices.length === 1, "auto-update should replace the old notice with one new notice");
  assert(state.notices[0].version === "v0.4.0", "the notice should be for v0.4.0");
  assert(state.notices[0].type === "applied", "auto-update notice should say what changed");
  sameDurable(durable, state);
});

check("a local edit is not overwritten; the owner chooses per field", function () {
  const state = model.createSimulation();
  const durable = model.durableState(state);
  const mine = "Design one Grok Bot at a time. Never create a bot until I say the job is clear.";
  model.editField(state, "instructions", mine);
  model.publishVersion(
    state,
    release("v0.3.0", "Offers the transcript skim once, on first run.", model.view(state).baseFields, {
      instructions: "Design one Grok Bot at a time. Offer the transcript skim once, on first run.",
      skills: "Design a Grok Bot. Routine healthcheck. Transcript healthcheck. First-run skim offer.",
    })
  );
  model.applyUpdate(state, {});
  assert(state.fields.instructions === mine, "update silently overwrote instructions");
  assert(state.fields.skills.indexOf("First-run skim offer.") !== -1, "untouched skills should still update");
  assert(state.openConflicts.indexOf("instructions") !== -1, "instructions should be listed as a conflict");
  assert(state.installedVersion === "v0.3.0", "the version should advance while the conflict stays flagged");

  model.resolveConflict(state, "instructions", "keep");
  assert(state.fields.instructions === mine, "keep mine should leave the owner text");
  assert(state.openConflicts.length === 0, "the conflict should close after a choice");

  model.publishVersion(
    state,
    release("v0.4.0", "Rewrites the opening instruction.", state.fields, {
      instructions: "Design one Grok Bot at a time. Ask for the audience before drafting.",
    })
  );
  model.applyUpdate(state, { instructions: "take" });
  assert(
    state.fields.instructions === "Design one Grok Bot at a time. Ask for the audience before drafting.",
    "take template should apply only after the owner chooses it"
  );
  assert(state.openConflicts.length === 0, "an explicit take should not stay flagged");
  sameDurable(durable, state);
});

check("auto-update skips conflicting fields and flags them", function () {
  const state = model.createSimulation();
  const durable = model.durableState(state);
  const mine = "Keep my Monday checkup note in the routine text.";
  model.editField(state, "routines", mine);
  model.setAutoUpdate(state, true);
  model.publishVersion(
    state,
    release("v0.3.0", "Tightens the Monday checkup wording.", state.baseFields || model.view(state).baseFields, {
      routines: "Monday checkup stays a report, not a delete.",
      skills: "Design a Grok Bot. Routine healthcheck. Transcript healthcheck. Report only.",
    })
  );
  assert(state.fields.routines === mine, "auto-update overwrote a local routine edit");
  assert(state.fields.skills.indexOf("Report only.") !== -1, "auto-update should still apply untouched skills");
  assert(state.openConflicts.indexOf("routines") !== -1, "auto-update should flag the skipped field");
  assert(state.notices.length === 1, "auto-update should post one notice");
  assert(state.notices[0].skippedFields.indexOf("routines") !== -1, "the notice should name the skipped field");
  sameDurable(durable, state);
});

check("one-step rollback restores the previous version and keeps durable state", function () {
  const state = model.createSimulation();
  const durable = model.durableState(state);
  const beforeFields = JSON.stringify(state.fields);
  model.publishVersion(
    state,
    release("v0.3.0", "Offers the transcript skim once, on first run.", state.fields, {
      skills: state.fields.skills + " First-run skim offer.",
    })
  );
  model.applyUpdate(state, {});
  assert(state.installedVersion === "v0.3.0", "precondition: update applied");
  const rolled = model.rollback(state);
  assert(rolled.rolledBack === true, "rollback should succeed");
  assert(state.installedVersion === "v0.2.0", "rollback should return to v0.2.0");
  assert(JSON.stringify(state.fields) === beforeFields, "rollback should restore field text");
  assert(state.notices.length === 1, "the single update-available notice should return");
  assert(state.notices[0].type === "available", "after rollback the notice is available again, once");
  const second = model.rollback(state);
  assert(second.rolledBack === false, "a second rollback has nothing to undo");
  sameDurable(durable, state);
});

check("publishing is deliberate, and an old pin keeps working", function () {
  const state = model.createSimulation();
  let threw = false;
  try {
    model.publishVersion(state, {
      version: "v0.3.0",
      changelog: "   ",
      fields: state.fields,
    });
  } catch (error) {
    threw = /changelog/i.test(error.message);
  }
  assert(threw, "a blank changelog should be rejected");
  assert(state.latestVersion === "v0.2.0", "a rejected publish must not move the template");

  const pinned = JSON.stringify(state.fields);
  model.publishVersion(
    state,
    release("v0.3.0", "Offers the transcript skim once, on first run.", state.fields, {
      name: "Dr Eggbot",
      skills: state.fields.skills + " First-run skim offer.",
    })
  );
  assert(JSON.stringify(state.fields) === pinned, "the installed pin should keep its fields");
  assert(state.versions["v0.2.0"], "the old published version should remain");
  assert(state.versions["v0.3.0"].changelog.length > 0, "the new version should store its changelog");
});

check("two new versions produce one notice each, not a notice per run", function () {
  const state = model.createSimulation();
  model.publishVersion(
    state,
    release("v0.3.0", "Offers the transcript skim once, on first run.", state.fields, {
      skills: state.fields.skills + " First-run skim offer.",
    })
  );
  model.publishVersion(
    state,
    release("v0.4.0", "Tightens the Monday checkup wording.", state.versions["v0.3.0"].fields, {
      routines: "Monday checkup stays a report, not a delete.",
    })
  );
  assert(state.notices.length === 2, "expected one available notice per version");
  assert(
    state.notices.map(function (notice) { return notice.version; }).join(",") === "v0.3.0,v0.4.0",
    "notices should follow the published versions"
  );
  model.runBot(state);
  model.runBot(state);
  assert(state.notices.length === 2, "runs must not duplicate version notices");
  model.applyUpdate(state, {});
  assert(state.installedVersion === "v0.4.0", "one-click update should land on the latest version");
  assert(state.notices.length === 1 && state.notices[0].type === "applied", "apply should collapse to one applied notice");
  assert(state.fields.routines === "Monday checkup stays a report, not a delete.", "latest routine text should land");
});

const failed = results.filter(function (item) { return !item.ok; });
results.forEach(function (item) {
  if (item.ok) {
    console.log("PASS  " + item.name);
  } else {
    console.log("FAIL  " + item.name);
    console.log("      " + item.error);
  }
});
console.log("");
console.log("Simulation scenarios: " + (results.length - failed.length) + "/" + results.length + " passed.");
console.log("Live product grade remains FAIL. This script does not clear it.");

if (failed.length > 0) {
  process.exit(1);
}
