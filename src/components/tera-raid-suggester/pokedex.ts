import * as PokeapiWrapper from "pokeapi-js-wrapper";
import z, { unknown } from "zod";

const RawMoveInfoSchema = z.object({
  damage_class: z.object({ name: z.string() }),
  power: z.number().nullable(),
  type: z.object({ name: z.string() }),
});

export type RawMoveInfo = z.infer<typeof RawMoveInfoSchema>;

export type MoveInfo = {
  name: string;
  damageClass: string;
  power: number;
  type: string;
};

export const pokedex = new PokeapiWrapper.Pokedex();

export const getMoveByName = async (
  movesArray: string[]
): Promise<MoveInfo[]> => {
  try {
    const rawMovesInfo = await pokedex.getMoveByName(
      movesArray.map((a: string) => a.replace(" ", "-").toLowerCase())
    );

    return rawMovesInfo
      .map((a: unknown, i: number) => {
        const result = RawMoveInfoSchema.safeParse(a);

        if (!result.success) {
          console.log("a", a);
          return null;
        }

        const { damage_class, power, type } = result.data;

        return {
          name: movesArray[i],
          damageClass: damage_class.name,
          power,
          type: type.name,
        };
      })
      .filter((a: MoveInfo | null) => a);
  } catch (e) {
    console.error(e);
  }

  return [];
};
