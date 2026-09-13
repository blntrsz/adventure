---
name: technical-writing
description: Write, structure, or review documentation with the Diátaxis method — authoring tutorials, how-to guides, reference, or explanation; deciding which type content belongs to; fixing blurred documentation.
---

Write documentation that serves the **user's need, not the machinery**. Every piece of content answers exactly one of four needs, and each need has its own form, structure, and language. Crossing between forms — **blur** — is the root cause of most documentation problems.

## Workflow

1. **Classify with the compass** — two questions, applied at whatever scale you're working (a whole doc, a page, a paragraph, a sentence):
   - Does this inform *action* (what the user does) or *cognition* (what the user knows)?
   - Is the user *acquiring* skill (study) or *applying* skill (work)?

   | informs | serves | mode |
   |---|---|---|
   | action | acquisition | **tutorial** |
   | action | application | **how-to guide** |
   | cognition | application | **reference** |
   | cognition | acquisition | **explanation** |

2. **Write to the mode's rules** — see Reference below. Each mode has its own obligations; content violating them is not wrong so much as in the wrong place — move or link it.
3. **Repeat**. Treat "improved the docs" as complete only when every piece of content in scope is classified to a mode and serves one user need in the language of that mode.

Work by **small steps, not plans**: pick any piece in front of you, make the single most valuable improvement, publish it, repeat. Don't impose a four-section skeleton up front or create empty category pages — structure emerges from well-formed pieces, from the inside. Documentation is never finished, but at every stage it should be **complete, not finished**: useful, healthy in structure, appropriate to its current stage.

## Reference: the four modes

| | question it answers | form | cooking analogy |
|---|---|---|---|
| tutorial | "Can you teach me to…?" | a lesson | teaching a child to cook |
| how-to guide | "How do I…?" | a series of steps | a recipe |
| reference | "What is…?" | dry description | the food-packet label |
| explanation | "Why…?" | discursive discussion | McGee's *On Food and Cooking* |

**Tutorial** — a learning experience under a teacher's care. The teacher owns the learner's success; the pupil only follows.
- Show where the learner is going from the start ("In this tutorial we will…"), and what results to expect at each step ("You will notice…").
- Deliver visible results early and often; every step produces something the learner can see.
- Target the *feeling of doing* — purpose and action joined into a confident rhythm the learner wants to repeat.
- Ruthlessly minimise explanation: one minimal justification ("We use HTTPS because it's safer") plus a link. Explanation dissolves a learner's attention; they learn through what they do, not through what you tell.
- Focus on the concrete; the general patterns will emerge on their own. Ignore options and alternatives — only what the task requires.
- Aspire to perfect reliability: the tutorial must work for every user, every time. Test with real users; you cannot discover your own failure points alone.

**How-to guide** — directions for an already-competent user doing real work. Not a lesson; assume familiarity with the tools and the vocabulary.
- Address the user's real-world goal, not the machinery's operations. "To shut off the water, turn the tap clockwise" is useless; the user needs to know *how much water, how vigorously, for what purpose*.
- Practical usability beats completeness: start and end at meaningful points and let the reader join the guide to their own work. Real problems fork and branch — "if this, then that" is at home here.
- Seek flow: order steps to match the user's thinking, not just causal necessity.
- Titles say exactly what the guide shows: "How to integrate X", never "Integrating X" (which might be about whether to) or bare "X" (which might be anything).

**Reference** — authoritative facts, consulted not read. Like a map: the user trusts it without re-checking the territory.
- **Neutral description** is the whole job: state facts about behaviour, list commands, options, limits, errors, warnings. Explaining, instructing, and discussing all corrupt it — link out to how-to guides and explanation instead.
- Adopt standard patterns and consistent form; this is the one place vocabulary variety earns nothing.
- Mirror the structure of the product: the doc's arrangement reflects the code's arrangement, making gaps visible.
- Use examples to illustrate without slipping into explaining.

**Explanation** — context, background, and reflection, serving study. The only docs worth reading away from the product.
- Talk *about* the subject: make connections, provide history and design context, draw implications.
- Admit opinion and perspective, weigh alternatives — it's discussion, not instruction.
- Keep it tightly bounded: explanation is where instruction and description creep in and die twice — once here, once by their absence where they belong.

## Language by mode

- Tutorial: "We…", "First do x. Now do y.", "The output should look like…"
- How-to: "This guide shows you how to…", "If you want x, do y."
- Reference: facts and lists only; "You must use a. Never d." for warnings.
- Explanation: "The reason for x is…", "W is better than z, because…", "Some users prefer w; this can be good, but…"

## The four blurs

| blur | cost | fix |
|---|---|---|
| explanation inside tutorials/how-to | breaks the doing | one-line reason + link out |
| instruction/description inside explanation | buries the reflection | move to the mode that owns it |
| how-to ops described from the machinery's side | answers a question nobody asked | rewrite around the human goal |
| tutorial conflated with how-to | the most common failure; see below | |

Tutorial vs. how-to is study vs. work — **not** basic vs. advanced (either can cover either). Test: is the user's responsibility to follow safely while you own their success (tutorial), or to get a particular real-world thing done with their own competence (how-to)? A clinical manual that tried to teach mid-surgery would kill people; the software equivalent just loses users. Reference vs. explanation is the same axis in the cognitive half: boring lists and tables → reference; something readable in the bath → explanation; a friend's answer to "tell me more about X" → explanation.
