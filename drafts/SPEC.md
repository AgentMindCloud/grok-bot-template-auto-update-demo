# Draft spec: template updates for an installed Grok Bot

Status: draft. This spec describes a simulation in `demo/`. It is not shipped in Grok Bot. The live product grade is FAIL, and this draft does not clear it.

The ask, from a user on X on 8 October 2026, is that a change to a published template such as Dr Eggbot reaches people who already installed a copy, either automatically or as an opt-in.

## Terms

- **Template.** A published recipe. Other people add their own bot from it.
- **Version.** A deliberate publish of that recipe, with a changelog line. Example: `v0.3.0`.
- **Installed copy.** The bot created on the owner's account from one version. It is pinned to that version until the owner updates it.
- **Local edit.** The owner has changed a field so it no longer matches the template value last applied to that field.
- **Durable state.** Memory, conversation, and routine schedule. These are not template fields.

Fields that can conflict: `name`, `instructions`, `routines`, `skills`.

## Version visibility

Every published version has a version id and a non-empty changelog line.

An installed bot shows:

`From template <name>, version <v>`

and whether a newer published version exists.

## Update path, per installed bot

Auto-update is **off** by default. The owner opts in per bot.

- **Off.** Each new version posts one "update available" notice. The notice includes that version's changelog and a one-click Update. Running the bot does not post the notice again. Two versions published before you update post two notices, one each.
- **On.** Each new version applies immediately and leaves one notice saying what changed. That notice replaces the previous update notice. There is not a second notice for the same version.

One-click Update moves the copy to the latest published version. It does not require deleting the bot or adding the template again.

Turning auto-update on while a version is already waiting applies that version once and leaves a single applied notice.

## Local edits

An update never writes over a field the owner edited when the template also changed that field.

- Untouched fields take the template value.
- Conflicting fields stay as the owner left them and are listed.
- The owner then chooses **Keep mine** or **Take template** for each conflict.
- Auto-update uses the same rule: it skips conflicting fields and names them on the one notice.

Keep mine acknowledges the new version and leaves the owner's text. Take template writes the template text for that field only.

## Rollback

An applied update stores the previous version, fields, and notices. Roll back restores that snapshot in one step. A second roll back does nothing if no earlier update is stored.

Rollback does not rewind memory, conversation, or routine schedule.

## Publisher

Publishing is explicit. A publish without a changelog line is rejected and does not change the template.

Older published versions remain. An installed copy pinned to an old version keeps its fields until that copy is updated.

## Durable state

Memory, conversation, and routine schedule survive publish, manual update, auto-update, conflict choice, and rollback.

## What the simulation refuses

The demo does not call the network, does not open a `grokbot://` install link, and does not create, publish, share, export, or install a real template.

`scripts/verify-template-updates.cjs` locks the rules above. A passing script means the draft matches this spec. It does not mean the live product does.
