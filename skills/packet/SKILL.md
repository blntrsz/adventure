---
name: packet
description: Structured handoff between lanes (PM, design, eng, EM, security, QA, partner) with owner and checkable done when. Use for /packet, hand off to design, send to eng, PM to EM, or cross-role collaboration.
disable-model-invocation: true
---

# Packet

Work moves between **lanes** here. Agent session continuity is `/handoff`.

## Steps

1. from_lane, to_lane, owner (a person from TEAM.md), due.
2. Write `docs/packets/` from `templates/packet.md`.
3. Intent is what the receiver must do. Decisions already made vs open for the receiver.
4. Evidence links each say why they matter.
5. Done when is checkable. Status `ready` only with an owner.
6. Tell the receiver the path. Do not paste the whole packet into chat.

**Done when** the file has both lanes, an owner, and a checkable done when.
