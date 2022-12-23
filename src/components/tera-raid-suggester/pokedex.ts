import z from "zod";
import localforage from "localforage";

import type { MoveInfo } from "./schemas";
import { MoveInfoSchema } from "./schemas";
import { getMove } from "./moves";

const getSafeMoveName = (moveName: string) =>
  moveName.replace(" ", "-").toLowerCase();

export const RawMoveInfoSchema = z.object({
  damage_class: z.object({ name: z.enum(["physical", "special", "status"]) }),
  power: z.number().nullable(),
  type: z.object({ name: z.string() }),
});

export type RawMoveInfo = z.infer<typeof RawMoveInfoSchema>;

export const getMoveByName = async (
  moveName: string
): Promise<MoveInfo | null> => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/move/${getSafeMoveName(moveName)}`
    );

    if (res.status !== 200) {
      console.warn(`Error when looking for move ${moveName}`, res.status);
      return null;
    }

    const rawMoveInfo = await res.json();

    const result = RawMoveInfoSchema.safeParse(rawMoveInfo);

    if (!result.success) {
      return null;
    }

    const { damage_class, power, type } = result.data;

    return {
      name: moveName,
      damageClass: damage_class.name,
      power,
      type: type.name,
    };
  } catch (e: any) {
    console.error(e);
  }

  return null;
};

export const getMoveByNameWithCache = async (
  moveName: string
): Promise<MoveInfo | null> => {
  const tempMove = getMove(moveName);

  if (tempMove) {
    return tempMove;
  }

  const moveDBKey = `move-${getSafeMoveName(moveName)}`;
  try {
    const tempMove = await localforage.getItem(moveDBKey);

    const result = MoveInfoSchema.safeParse(tempMove);

    if (result.success) {
      return result.data;
    }
  } catch (e) {
    console.error(`error when fetching move ${moveName}`, e);
  }

  const moveInfo = await getMoveByName(moveName);

  localforage.setItem(moveDBKey, moveInfo);

  return moveInfo;
};

export const getMovesByName = async (
  movesArray: string[]
): Promise<MoveInfo[]> => {
  const moves: MoveInfo[] = [];
  for (const moveName of movesArray) {
    const moveInfo = await getMoveByNameWithCache(moveName);

    if (moveInfo) {
      moves.push(moveInfo);
    }
  }

  return moves;
};
