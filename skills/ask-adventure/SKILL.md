---
name: ask-adventure
description: Router over Adventure user-invoked skills. Use when the user asks which skill, playbook, or PDLC stage to run, or says /ask-adventure, what should I run, or how do we start.
disable-model-invocation: true
---

# Ask Adventure

Pick one next skill. Do not run it.

## Steps

1. Read `.adventure/config.yaml` if present. Note lanes and current docs.
2. Classify the user's situation into one stage: discover, shape, sequence, build, prove, review, ship, learn, collaborate, incident.
3. Recommend one user-invoked skill and one playbook if `/adventure-mode` is enough.
4. Name the lane that must be in the room.
5. If two skills tie, prefer `/align` (misalignment) or `/gate` (they think they are done).

**Done when** the user has a single slash command, a lane, and a one-line why.
