import type { ReactNode } from 'react';
import { aiLevate, education, profile, publication, summary, tiket, tiketStats } from '../data/resume';
import { Bullets, Chips, ContactCard, LinkRow, ProjectPicker, SkillsInventory, Stats } from '../components/DialogBodies';
import type { PlaceId } from '../game/map';

export interface DialogPage {
  speaker?: string;
  /** Typed out letter by letter; **bold** is applied once typing finishes. */
  say?: string;
  body?: ReactNode;
}

export interface DialogScript {
  title: string;
  icon: string;
  pages: DialogPage[];
}

export type ScriptId = PlaceId | 'intro' | 'questDone';

const STACK = ['Python', 'FastAPI', 'PyTorch', 'TensorFlow', 'XGBoost', 'CatBoost', 'Kubeflow', 'Jenkins', 'GitHub Actions', 'Docker', 'Kubernetes', 'Terraform', 'AWS', 'Google Cloud'];

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export function getScript(id: ScriptId): DialogScript {
  switch (id) {
    case 'intro':
      return {
        title: 'Welcome',
        icon: '👋',
        pages: [
          { speaker: profile.shortName, say: `Hey there, traveler! I'm ${profile.shortName}, a **Machine Learning Engineer** based in ${profile.location}.` },
          { speaker: profile.shortName, say: 'Welcome to my little town. Every building holds a chapter of my story: work, projects, skills, and school.' },
          {
            speaker: profile.shortName,
            say: 'Walk with **WASD** or the **arrow keys** (or tap a building), face a door and press **E**. In a hurry? Hit **Quick view** up top for the plain resume.',
          },
        ],
      };
    case 'home':
      return {
        title: "Stanley's Home",
        icon: '🏠',
        pages: [
          { speaker: profile.shortName, say: `Home sweet home! ${summary[0]}` },
          { speaker: profile.shortName, say: summary[2] },
          { speaker: profile.shortName, say: summary[3] },
          { speaker: profile.shortName, say: 'And here is my everyday toolkit:', body: <Chips items={STACK} /> },
        ],
      };
    case 'tiket': {
      const pages = chunk(tiket.bullets, 2);
      return {
        title: `${tiket.company} HQ`,
        icon: '✈️',
        pages: [
          {
            speaker: 'Receptionist',
            say: `Welcome to ${tiket.company} in ${tiket.location}! Stanley worked here as a **${tiket.role}** from ${tiket.dates}.`,
            body: <Stats items={tiketStats} />,
          },
          ...pages.map((items, i) => ({
            speaker: `Quest log ${i + 1}/${pages.length}`,
            body: (
              <>
                <Bullets items={items} />
                {i === pages.length - 1 && tiket.links && <LinkRow links={tiket.links} />}
              </>
            ),
          })),
        ],
      };
    }
    case 'ailevate': {
      const pages = chunk(aiLevate.bullets, 2);
      return {
        title: aiLevate.company,
        icon: '🤖',
        pages: [
          {
            speaker: 'Office bot',
            say: `Beep boop! This is ${aiLevate.company}, ${aiLevate.location}. Stanley is an **${aiLevate.role}** here, ${aiLevate.dates}.`,
          },
          ...pages.map((items, i) => ({ speaker: `Quest log ${i + 1}/${pages.length}`, body: <Bullets items={items} /> })),
        ],
      };
    }
    case 'lab':
      return {
        title: 'Project Lab',
        icon: '🧪',
        pages: [{ speaker: 'Lab assistant', say: 'Welcome to the Lab! Pick an experiment to inspect.', body: <ProjectPicker /> }],
      };
    case 'forge':
      return {
        title: 'Skills Forge',
        icon: '⚒️',
        pages: [{ speaker: 'Blacksmith', say: 'Every tool here has been sharpened in production. Inventory:', body: <SkillsInventory /> }],
      };
    case 'uni':
      return {
        title: 'University',
        icon: '🎓',
        pages: education.map((s) => ({
          speaker: s.name,
          say: `**${s.degree}**, ${s.name} (${s.location}), ${s.dates}.`,
          body: <Bullets items={[s.note]} />,
        })),
      };
    case 'library':
      return {
        title: 'Library',
        icon: '📚',
        pages: [
          {
            speaker: 'Librarian',
            say: `Shh... one of Stanley's papers is on the shelf: **${publication.title}** (${publication.venue}).`,
            body: (
              <>
                <Bullets items={[publication.note]} />
                <LinkRow links={publication.links} />
              </>
            ),
          },
        ],
      };
    case 'mailbox':
      return {
        title: 'Mailbox',
        icon: '✉️',
        pages: [{ speaker: 'Mailbox', say: 'You found the mailbox! Want to say hi? Send Stanley a message:', body: <ContactCard /> }],
      };
    case 'sign':
      return {
        title: 'Town sign',
        icon: '🪧',
        pages: [
          {
            speaker: 'Sign',
            say: '**Stanley Town**, pop. 1. Visit all 8 places to finish the quest, and grab the ⚡ GPU credits lying around for fun facts.',
          },
        ],
      };
    case 'questDone':
      return {
        title: 'Quest complete!',
        icon: '🏆',
        pages: [
          {
            speaker: profile.shortName,
            say: "You've visited every place in town. Thanks for exploring! If you'd like to work together or just chat about ML systems, my mailbox is always open.",
            body: <ContactCard />,
          },
        ],
      };
  }
}
