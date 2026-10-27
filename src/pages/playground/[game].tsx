import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Seo } from "@/components/layout/Seo";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell";
import { games, getGame, type GameId } from "@/content/games";

interface Props {
  id: GameId;
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: games.map((g) => ({ params: { game: g.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const game = getGame(String(params?.game ?? ""));
  return game ? { props: { id: game.id } } : { notFound: true };
};

// Each game is its own chunk, loaded only on its page, so one game's code never slows down another's.
// They still render on the server: every game starts on an intro screen that doesn't depend on randomness.
const components: Record<GameId, ComponentType> = {
  "developers-mind": dynamic(() => import("@/components/lab/DevelopersMind").then((m) => m.DevelopersMind)),
  "brain-clash": dynamic(() => import("@/components/lab/BrainClashMini").then((m) => m.BrainClashMini)),
  snake: dynamic(() => import("@/components/playground/SnakeGame").then((m) => m.SnakeGame)),
  "code-quest": dynamic(() => import("@/components/playground/CodeQuest").then((m) => m.CodeQuest)),
  "bug-hunter": dynamic(() => import("@/components/playground/BugHunter").then((m) => m.BugHunter)),
  "memory-match": dynamic(() => import("@/components/playground/MemoryMatch").then((m) => m.MemoryMatch)),
  terminal: dynamic(() => import("@/components/playground/DevTerminal").then((m) => m.DevTerminal)),
};

export default function GamePage({ id }: Props) {
  const game = getGame(id);
  if (!game) return null;
  const Game = components[id];
  return (
    <>
      <Seo title={`${game.name} · Lab`} description={`${game.summary} ${game.detail}`} />
      <PlaygroundShell game={game}>
        <Game />
      </PlaygroundShell>
    </>
  );
}
