# Grok Bot template updates

Grade of the live Grok Bot product against one request: when a published template changes, installed copies should hear about it and be able to take the update, automatically or as an opt-in, without losing local edits.

**Live grade: FAIL.** The write-up is [RECEIPT.md](RECEIPT.md). The draft spec and help page do not clear that fail.

## Draft simulation

Public demo, no sign-in: https://agentmindcloud.github.io/grok-bot-template-auto-update-demo/

The page is [index.html](index.html) (the model inlined, one self-contained file), also at [demo/index.html](demo/index.html). It is a static page: no network calls, no secrets, no install link. The banner states the live grade: FAIL. It is a draft simulation and does not clear the fail.

From the repo root, with Node:

```bash
node scripts/verify-template-updates.cjs
```

The script checks the simulation (version badge, one notice per version, auto-update off by default, per-field keep-or-take, rollback, durable memory and schedule). It does not grade the live product.

To serve it locally instead, run `python3 -m http.server 8000 --directory demo` and open http://127.0.0.1:8000/.

## What the live product does instead

A template share gives each person their own copy. Official docs tell the recipient to add that copy. They do not tell an existing copy how to move to a later version. For Dr Eggbot, the author's public instruction is to reinstall and copy over anything worth keeping. Quotes and URLs are in the receipt.
