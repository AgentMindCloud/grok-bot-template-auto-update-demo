"use strict";

/**
 * Draft contract for Grok Bot template updates.
 * This module is a simulation. It does not talk to Grok Bot, and it does not
 * clear a live FAIL.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.TemplateUpdates = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const FIELDS = ["name", "instructions", "routines", "skills"];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function seedFields() {
    return {
      name: "Dr Eggbot",
      instructions:
        "Design one Grok Bot at a time. Ask a few preference questions, then create it. Keep the voice short and lowercase.",
      routines:
        "Weekday transcript skim and a Monday routine checkup. Stay quiet when there is nothing to propose.",
      skills: "Design a Grok Bot. Routine healthcheck. Transcript healthcheck.",
    };
  }

  function createSimulation() {
    const fields = seedFields();
    const version = "v0.2.0";
    return {
      templateName: "Dr Eggbot",
      templateId: "dr-eggbot",
      latestVersion: version,
      versions: {
        [version]: {
          version: version,
          changelog:
            "Health check on routines, and a daily transcript skim. Shipped as the installed copy.",
          fields: clone(fields),
        },
      },
      installedVersion: version,
      autoUpdate: false,
      fields: clone(fields),
      baseFields: clone(fields),
      openConflicts: [],
      notices: [],
      history: [],
      memory: [
        {
          id: "mem-voice",
          text: "Owner prefers short lowercase, and does not want a bot created until the job is clear.",
        },
      ],
      conversation: [
        {
          id: "msg-1",
          role: "owner",
          text: "Skip the fleet checkup this week.",
        },
      ],
      routineSchedule: {
        label: "Mondays 8:49 PT",
        cron: "49 8 * * 1",
      },
      runCount: 0,
      nextNoticeId: 1,
    };
  }

  function durableState(state) {
    return {
      memory: clone(state.memory),
      conversation: clone(state.conversation),
      routineSchedule: clone(state.routineSchedule),
    };
  }

  function badge(state) {
    return {
      text:
        "From template " +
        state.templateName +
        ", version " +
        state.installedVersion,
      templateName: state.templateName,
      installedVersion: state.installedVersion,
      latestVersion: state.latestVersion,
      newer: state.installedVersion !== state.latestVersion,
    };
  }

  function requireFieldMap(fields) {
    if (!fields || typeof fields !== "object") {
      throw new Error("A published version needs name, instructions, routines, and skills.");
    }
    const next = {};
    for (let i = 0; i < FIELDS.length; i += 1) {
      const key = FIELDS[i];
      if (typeof fields[key] !== "string" || fields[key].trim() === "") {
        throw new Error("A published version needs a " + key + " value.");
      }
      next[key] = fields[key];
    }
    return next;
  }

  function addNotice(state, notice) {
    const already = state.notices.some(function (item) {
      return item.type === notice.type && item.version === notice.version;
    });
    if (already) {
      return false;
    }
    state.notices.push({
      id: "notice-" + state.nextNoticeId,
      type: notice.type,
      version: notice.version,
      changelog: notice.changelog,
      changedFields: notice.changedFields.slice(),
      skippedFields: notice.skippedFields.slice(),
    });
    state.nextNoticeId += 1;
    return true;
  }

  function snapshot(state) {
    return {
      installedVersion: state.installedVersion,
      fields: clone(state.fields),
      baseFields: clone(state.baseFields),
      openConflicts: state.openConflicts.slice(),
      notices: clone(state.notices),
      nextNoticeId: state.nextNoticeId,
    };
  }

  function applyUpdate(state, choices) {
    const picked = choices || {};
    if (state.installedVersion === state.latestVersion) {
      return { applied: false, changedFields: [], skippedFields: [] };
    }

    const latest = state.versions[state.latestVersion];
    const before = snapshot(state);
    const changedFields = [];
    const skippedFields = [];

    for (let i = 0; i < FIELDS.length; i += 1) {
      const field = FIELDS[i];
      const incoming = latest.fields[field];
      const drifted = state.fields[field] !== state.baseFields[field];
      const templateChanged = incoming !== state.baseFields[field];
      if (drifted && templateChanged) {
        const choice = picked[field];
        if (choice === "take") {
          state.fields[field] = incoming;
          state.baseFields[field] = incoming;
          changedFields.push(field);
        } else if (choice === "keep") {
          state.baseFields[field] = incoming;
        } else {
          skippedFields.push(field);
        }
      } else if (templateChanged) {
        state.fields[field] = incoming;
        state.baseFields[field] = incoming;
        changedFields.push(field);
      }
    }

    state.installedVersion = latest.version;
    state.openConflicts = skippedFields.slice();
    state.history.push(before);
    state.notices = [];
    addNotice(state, {
      type: "applied",
      version: latest.version,
      changelog: latest.changelog,
      changedFields: changedFields,
      skippedFields: skippedFields,
    });

    return {
      applied: true,
      changedFields: changedFields,
      skippedFields: skippedFields,
    };
  }

  function publishVersion(state, release) {
    if (!release || typeof release.changelog !== "string" || release.changelog.trim() === "") {
      throw new Error("A new version needs a changelog line.");
    }
    if (typeof release.version !== "string" || release.version.trim() === "") {
      throw new Error("Publish a new version deliberately.");
    }
    if (state.versions[release.version]) {
      throw new Error("That version is already published.");
    }
    const fields = requireFieldMap(release.fields);
    const version = release.version.trim();
    state.versions[version] = {
      version: version,
      changelog: release.changelog.trim(),
      fields: fields,
    };
    state.latestVersion = version;

    if (state.autoUpdate) {
      return applyUpdate(state, {});
    }

    addNotice(state, {
      type: "available",
      version: version,
      changelog: release.changelog.trim(),
      changedFields: FIELDS.filter(function (field) {
        return fields[field] !== state.fields[field];
      }),
      skippedFields: [],
    });
    return { applied: false, changedFields: [], skippedFields: [] };
  }

  function setAutoUpdate(state, on) {
    const next = Boolean(on);
    const turnedOn = next && !state.autoUpdate;
    state.autoUpdate = next;
    if (turnedOn && state.installedVersion !== state.latestVersion) {
      return applyUpdate(state, {});
    }
    return { applied: false, changedFields: [], skippedFields: [] };
  }

  function editField(state, field, value) {
    if (FIELDS.indexOf(field) === -1) {
      throw new Error("Unknown field.");
    }
    if (typeof value !== "string") {
      throw new Error("A field value must be text.");
    }
    state.fields[field] = value;
    return state.fields[field] !== state.baseFields[field];
  }

  function resolveConflict(state, field, choice) {
    if (state.openConflicts.indexOf(field) === -1) {
      throw new Error("That field is not in conflict.");
    }
    if (choice !== "keep" && choice !== "take") {
      throw new Error("Choose keep or take.");
    }
    const latest = state.versions[state.installedVersion];
    if (!latest) {
      throw new Error("Installed version is missing.");
    }
    if (choice === "take") {
      state.fields[field] = latest.fields[field];
    }
    state.baseFields[field] = latest.fields[field];
    state.openConflicts = state.openConflicts.filter(function (item) {
      return item !== field;
    });
    return { field: field, choice: choice };
  }

  function runBot(state) {
    const before = state.notices.length;
    state.runCount += 1;
    return {
      runCount: state.runCount,
      noticesAdded: state.notices.length - before,
    };
  }

  function rollback(state) {
    const previous = state.history.pop();
    if (!previous) {
      return { rolledBack: false };
    }
    state.installedVersion = previous.installedVersion;
    state.fields = previous.fields;
    state.baseFields = previous.baseFields;
    state.openConflicts = previous.openConflicts;
    state.notices = previous.notices;
    state.nextNoticeId = previous.nextNoticeId;
    return { rolledBack: true, version: state.installedVersion };
  }

  function view(state) {
    const info = badge(state);
    return {
      badgeText: info.text,
      templateName: info.templateName,
      installedVersion: info.installedVersion,
      latestVersion: info.latestVersion,
      newer: info.newer,
      autoUpdate: state.autoUpdate,
      fields: clone(state.fields),
      baseFields: clone(state.baseFields),
      openConflicts: state.openConflicts.slice(),
      notices: clone(state.notices),
      memory: clone(state.memory),
      conversation: clone(state.conversation),
      routineSchedule: clone(state.routineSchedule),
      runCount: state.runCount,
      canRollback: state.history.length > 0,
      latestChangelog: state.versions[state.latestVersion].changelog,
    };
  }

  return {
    FIELDS: FIELDS,
    createSimulation: createSimulation,
    durableState: durableState,
    badge: badge,
    publishVersion: publishVersion,
    setAutoUpdate: setAutoUpdate,
    editField: editField,
    resolveConflict: resolveConflict,
    applyUpdate: applyUpdate,
    runBot: runBot,
    rollback: rollback,
    view: view,
  };
});
