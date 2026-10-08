# RECEIPT: Grok Bot template auto-update

**Overall grade: FAIL**

The ask is that when a published Grok Bot template changes, people who already installed a copy find out and can take the update, either automatically or as an opt-in, without losing local edits. Public docs, the changelog through 7 October 2026, the live Dr Eggbot share page, and the template author's own update note describe a one-time copy. There is no installed-copy version, no once-per-version update notice, and no in-place update.

This draft does not clear the fail. PASS would require a second operator to do the whole path on a live account from the UI and the docs. That was not done. Installing, publishing, sharing, or exporting a real template was out of bounds, so several cases stay UNVERIFIED.

Checked 8 October 2026.

## Ask

[@Deluca98_](https://x.com/Deluca98_/status/2108112609610256863), 8 October 2026, reply to [@poteto](https://x.com/poteto/status/2108042827007656059):

> Two requests: some form of grok/grok bot overlay with onscreen context. And automatic grokbot template updates, ie if you make a change to dr eggbot for instance it updates for everyone automatically /have the option for automatic updates.

The onscreen-context overlay is out of scope. The template-update half is graded below.

The post this replies to links the live share page [https://x.ai/bot/_jOdbfkB16zxu7MRcmReE](https://x.ai/bot/_jOdbfkB16zxu7MRcmReE) ("dr eggbot").

## Case table

| # | Failure | Grade | Why |
| --- | --- | --- | --- |
| 1 | An installed copy shows no template name or version, so the owner can't tell it's out of date. | FAIL | Documented bot settings and the live share page have no template version. The only "added from a template" UI note is that the bot's own name shows once in the sidebar. |
| 2 | A new template version ships, and installed owners get no notice and no update path except reinstalling from scratch. | FAIL | The Dr Eggbot author says to reinstall and copy anything worth keeping onto the new bot. Product docs describe Add, not Update, for a recipient. |
| 3 | An update (manual or auto) silently overwrites the owner's edited instructions, routines, or skills. | UNVERIFIED | No in-place template update is documented, so overwrite was not observed. Reinstall leaves the old bot until the owner deletes it. A live install was not performed. |
| 4 | Auto-update can't be turned off, or it's on by default without the owner opting in. | UNVERIFIED | No per-bot template auto-update control is documented. App Automatic Updates is a different switch and was not graded as this control. Live Settings were not opened. |
| 5 | The "update available" notice repeats every run or never shows, instead of once per new version. | FAIL | No template "update available" notice exists in help or the changelog. The author's version notes are posts on X, and they tell people to reinstall. |
| 6 | No rollback: a bad template version can't be undone without rebuilding the bot. | FAIL | The published way back is a new install plus deleting the old bot. Help and the changelog do not describe one-step rollback of a template version. |
| 7 | Updating resets the bot's memory, conversation, or routines' schedule state. | FAIL | A new copy does not carry memory or conversation. The author tells owners to ask the new bot to copy over what they want. |
| 8 | The "fix" is a docs note telling people to re-copy the template by hand. | FAIL | The author's update instruction is reinstall and hand carry-over. Staff's interim note for template skills that do not import is to copy the skill text and recreate it. |

## Evidence

### Templates are a copy, not a subscription

[Work with Grok Bot](https://cursor.com/docs/grok-bot/work), Share a Bot:

> The recipient adds a copy to their own account; they never get your computer, logins, or conversation history, and adding a shared Bot accepts the third-party bot terms shown at that point.

[Create and manage Bots](https://docs.x.ai/grok-bot/bots), Share a Bot:

> Open the Share menu and choose Create template. The Bot builds the template; when it is ready, Copy link, View template details, and Update template appear.

> Adding a shared Bot creates a copy on the recipient's account. It does not give them your computer, logins, or conversation history.

"Update template" is on the publisher's share menu, next to Copy link and View template details. The same page's recipient step is Add to Grok Bot. It does not say the add updates a bot the person already has.

[Templates for Grok Bot](https://x.ai/bot/guides/templates-for-grok-bot) (8 September 2026, Matt Palmer):

> Templates create a blueprint for another user to launch a copy of your bot.

> Now we have a distinct new copy of the bot.

[Team Bots](https://cursor.com/help/grok-bot/team-bots):

> A Team Bot link opens the same shared Bot. It's different from sharing a Bot template, which gives each person their own copy.

Team Bots are a different feature (one shared bot). They are not an update channel for template installs.

### Changelog: app updates shipped; installed-template updates did not

[Grok Bot changelog](https://x.ai/changelog/bot), read 8 October 2026. Latest entry on that page: **v0.68.1, 7 October 2026**.

v0.30.0, 28 August 2026:

> Share a Bot as a template: choose whether your team or anyone can use it, and others add their own copy from the link.

v0.37.0, 3 September 2026:

> Share as template, Update template, and View template details are in the share menu in the chat header.

> A Bot added from a template shows its name only once in the sidebar.

v0.35.0, 2 September 2026:

> Opening a shared Bot again shows its latest version, including its integrations.

That bullet does not mention an installed copy, a changelog, a notice, an opt-in, conflicts, or rollback. The same day, the Dr Eggbot author still told people to reinstall (below). Nothing from v0.30.0 through v0.68.1 describes a version badge on an installed copy, one notice per template version, field-level conflict choice, or one-step rollback of a template update.

v0.65.0, 30 September 2026, is the desktop app, not a template:

> Automatic Updates is on by default, so Grok Bot restarts to apply updates while you're away; turn it off in Settings → Updates.

[Settings](https://cursor.com/docs/grok-bot/settings) lists Updates as Check for Updates, Restart to Update, and Update Grok Bot's Computer. Per-bot settings are:

> edit one Bot's name, label, description, and notifications preference.

[How do I update Grok Bot?](https://cursor.com/help/grok-bot/how-to):

> The desktop app checks for updates on its own. When one is ready, the account menu shows New update available. Choose Install, then Restart to update.

[How do I find my Grok Bot version?](https://cursor.com/help/grok-bot/how-to) points at the account menu About dialog. That is the app build, not a template version.

### Help center has no template-update article

`https://cursor.com/help/grok-bot` returns **307** to `/help` (8 October 2026). These paths return **404**:

- https://cursor.com/help/grok-bot/templates
- https://cursor.com/help/grok-bot/sharing
- https://cursor.com/help/grok-bot/bot-templates
- https://cursor.com/help/grok-bot/export

The help index in [llms.txt](https://cursor.com/llms.txt) lists Grok Bot how-to, FAQs, edit bot, team bots, routines, and related pages. It does not list a template, sharing, or export article. Admin "Public template sharing" on [Grok Bot for Teams and Enterprise](https://cursor.com/docs/grok-bot/teams) only controls whether members can publish outside the team.

### The live Dr Eggbot page has no version

Share page linked from [@poteto, 8 October 2026](https://x.com/poteto/status/2108042827007656059): [https://x.ai/bot/_jOdbfkB16zxu7MRcmReE](https://x.ai/bot/_jOdbfkB16zxu7MRcmReE).

Public HTML on 8 October 2026:

- Title: `dr eggbot`
- Description begins: "Designs high-quality Grok Bots. Asks a few preference questions, then creates them with CreateAgent."
- Action: "Add to Grok Bot", linking to `grokbot://app/v1/bot-template?id=_jOdbfkB16zxu7MRcmReE`
- No version string and no changelog in the page HTML

The page was not submitted. Add to Grok Bot was not clicked.

### The author's update path is reinstall

[@poteto, 2 September 2026](https://x.com/poteto/status/2094967827019243547), Dr Eggbot v0.2.0, linking [https://x.ai/bot/93gOz3op1UQdBdbekQFLK](https://x.ai/bot/93gOz3op1UQdBdbekQFLK):

> to update you will need to reinstall dr eggbot. if you have anything you want to carry over, ask the new bot to copy over anything relevant, and then you can delete the old one

That is the failure in cases 2, 5, 6, 7, and 8, in the publisher's own words. Versions such as v0.2.0 are written in the post. They are not a field on the share page above.

### Staff: a shared template does not carry the live bot

Forum thread [Shared Grok Bot team across teammates](https://forum.cursor.com/t/shared-grok-bot-team-across-teammates-same-roster-separate-chats/169904). Reply by Colin, Community Support Engineer, CursorStaff, 30 August 2026:

> You are right that sharing a bot today creates a copy. Bot templates shipped recently as a first step, but they do not carry over live memory or conversation history.

### Staff: when template content does not arrive, copy it by hand

Forum thread [skills are never delivered](https://forum.cursor.com/t/grok-bot-templates-preview-shows-skills-but-the-export-ships-skills-skills-are-never-delivered/169911). Reply by Mohit, CursorStaff, 31 August 2026:

> In the meantime, since the full skill body shows in the template preview, you can copy it and ask the new bot to recreate it, e.g. "Create a skill called with this content: ". That gets the skill onto the imported bot until imports handle this end to end.

That note is about the first import of skills, not about a later template version. It is still the written staff fix for template content the product did not apply: copy it by hand. It is cited for case 8, not as proof of silent overwrite (case 3).

## What was not tested, and why

- No bot was created. No template was published, shared, exported, or installed. Add to Grok Bot was not used. Those actions are forbidden for this grade, so anything that only a live install could show stays UNVERIFIED.
- A logged-in Grok Bot session was not opened. Case 4's Settings switch was not looked at on an account. The public Settings page was.
- Notice frequency across real bot runs was not watched. Case 5 is FAIL because the notice is absent from the docs and the changelog, not because a run was observed skipping it.
- Conflict choice and rollback were not clicked in the product. The draft demo does those steps. The draft does not clear the fail.
- A second operator did not repeat a live update from the UI and docs alone. Criterion (e) for PASS is unmet.
- Out of scope, and not graded: whether a starter template exists, the onscreen-context overlay, usage meters, RPM 403, usage breakdown, and account linking.

## Why this is not a PASS

PASS needs all of these on a live account:

- (a) an installed bot shows its template name and version
- (b) one notice and a one-click Update when auto-update is off, and one notice plus an automatic apply when the owner opted in
- (c) edited fields are not overwritten, and the conflict is shown
- (d) one-step rollback, with memory, history, and schedules intact
- (e) a second operator can do this from the UI and the docs alone

(a) through (e) were not shown. The public record contradicts (a), (b), and (e), and the author's reinstall note contradicts (d) and the durable-state half of the ask.

## Draft

The files under `drafts/` and `demo/` specify the missing behavior and simulate it. `node scripts/verify-template-updates.cjs` checks that simulation. A passing script does not change this grade.
