# Update a bot you added from a template

**Draft help. Not a live Grok Bot article.** The live product grade for this behavior is FAIL. This page does not clear that fail. Checked against public docs on 8 October 2026: Grok Bot help has no article for updating an installed template copy. `https://cursor.com/help/grok-bot/templates`, `/sharing`, `/bot-templates`, and `/export` return 404. Sharing is documented as adding a new copy, not as updating one you already have.

## How do I see which template version I have?

Open the bot. Under its name, the details read:

`From template Dr Eggbot, version v0.2.0`

If the publisher has shipped a later version, the same place says a newer version exists. The version is the template publish, not the Grok Bot app version in About.

## How do I get a newer version?

Auto-update is off until you turn it on for that bot.

With it off, you get one notice per new version. The notice shows the changelog and an Update button. Update applies that version to this bot. Running the bot does not show the notice again.

With auto-update on, the new version applies on its own. You get one notice that says what changed.

You do not delete the bot, and you do not add the template a second time.

## What if I edited the bot?

Update does not replace a field you edited when the template changed that same field. Instructions, routines, skills, and the name each get their own choice:

- **Keep mine** leaves your text.
- **Take template** uses the new template text for that field only.

Fields you did not edit take the template value. Auto-update skips the conflicting fields and lists them on the notice so you can choose later.

## Can I undo an update?

Yes. Roll back this update returns the bot to the previous template version in one step, including the field text from before that update.

Memory, the conversation, and routine schedules stay through the update and through the rollback.

## How does a publisher ship a new version?

The publisher publishes a version on purpose and writes a changelog line. A publish with no changelog does not go out. People still on an older version keep that version until they update.

## What does not change

- Memory the bot has saved
- The conversation already in the chat
- When a routine is scheduled to run

Those belong to the installed bot, not to the template recipe.
