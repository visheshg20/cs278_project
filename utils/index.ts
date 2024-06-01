import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const activitiesMap = {
  "Casual soccer match": { emoji: "⚽️", image: "/activities/soccer.jpeg" },
  "Super Smash Bros & Mario Kart Tournament": {
    emoji: "🎮",
    image: "/activities/smash.jpeg",
  },
  "Board Game Nights": { emoji: "🎲", image: "/activities/board-games.jpeg" },
  "Group Hikes": { emoji: "🥾", image: "/activities/hike.jpeg" },
  "Rock Climbing": { emoji: "🧗‍♂️", image: "/activities/rock-climb.jpeg" },
  "Cooking Classes": { emoji: "🍳", image: "/activities/cooking.jpeg" },
  "Wine & Cheese Night": { emoji: "🍷", image: "/activities/wine.jpeg" },
  Volunteering: { emoji: "🤝", image: "/activities/volunteer.jpeg" },
};
