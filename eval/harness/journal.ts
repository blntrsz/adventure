// Local-Markdown Journal reader (Q4 §2): the fixture-side model that state
// assertions speak through. If the `.adventure/` layout ever changes, this is
// the one file to update (Q4 §10).
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Fixture, JournalTicket, JournalView } from "./types.ts";

const JOURNAL_DIR = ".adventure";

async function readTickets(dir: string): Promise<JournalTicket[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir);
  const tickets: JournalTicket[] = [];
  for (const name of entries.filter((e) => e.endsWith(".md")).sort()) {
    const path = join(dir, name);
    const body = await readFile(path, "utf8");
    const titleMatch = body.match(/^#\s+(.+)$/m);
    tickets.push({ path, title: titleMatch?.[1]?.trim() ?? name, body });
  }
  return tickets;
}

/** Open a Journal view over a fixture's `.adventure/` directory + AGENTS.md. */
export function openJournal(fixture: Fixture): JournalView {
  const adventuresDir = join(fixture.root, JOURNAL_DIR, "adventures");
  const questsDir = join(fixture.root, JOURNAL_DIR, "quests");
  return {
    async adventures() {
      return readTickets(adventuresDir);
    },
    async quests() {
      return readTickets(questsDir);
    },
    async configSection() {
      const agentsPath = join(fixture.root, "AGENTS.md");
      if (!existsSync(agentsPath)) return null;
      const body = await readFile(agentsPath, "utf8");
      const lines = body.split(/\r?\n/);
      const start = lines.findIndex((l) => l.trim() === "## Adventure");
      if (start === -1) return null;
      const out: string[] = [];
      for (let i = start + 1; i < lines.length; i++) {
        if (lines[i].startsWith("## ")) break;
        out.push(lines[i]);
      }
      return out.join("\n").trim() || null;
    },
  };
}
