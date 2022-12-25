import type { PokedexEntry } from "../../schemas";

export const getPokemon = (name: string): PokedexEntry | null => {
  switch (name) {
    case "Kilowattrel":
      return {
        name,
        types: ["electric", "flying"],
        abilities: ["wind-power", "vold-absorb"],
        hiddenAbility: "competitive",
        baseStats: {
          hp: 70,
          atk: 70,
          def: 60,
          spa: 105,
          spd: 60,
          spe: 125,
        },
      };
    case "Mimikyu":
      return {
        name,
        types: ["ghost", "fairy"],
        abilities: ["disguise"],
        hiddenAbility: null,
        baseStats: {
          hp: 55,
          atk: 90,
          def: 80,
          spa: 50,
          spd: 105,
          spe: 96,
        },
      };
    case "Armarouge":
      return {
        name,
        types: ["fire", "psychic"],
        abilities: ["flash-fire"],
        hiddenAbility: "weak-armor",
        baseStats: {
          hp: 85,
          atk: 60,
          def: 100,
          spa: 125,
          spd: 80,
          spe: 75,
        },
      };
    case "Tinkaton":
      return {
        name,
        types: ["fairy", "steel"],
        abilities: ["mold-breaker", "own-tempo"],
        hiddenAbility: "pickpocket",
        baseStats: {
          hp: 85,
          atk: 75,
          def: 77,
          spa: 70,
          spd: 105,
          spe: 94,
        },
      };
    case "Cyclizar":
      return {
        name,
        types: ["dragon", "normal"],
        abilities: ["shed-skin"],
        hiddenAbility: "regenerator",
        baseStats: {
          hp: 70,
          atk: 95,
          def: 65,
          spa: 85,
          spd: 65,
          spe: 121,
        },
      };
    case "Grafaiai":
      return {
        name,
        types: ["poison", "normal"],
        abilities: ["unburden", "poison-touch"],
        hiddenAbility: "prankster",
        baseStats: {
          hp: 63,
          atk: 95,
          def: 65,
          spa: 80,
          spd: 72,
          spe: 110,
        },
      };
    case "Toedscruel":
      return {
        name,
        types: ["ground", "grass"],
        abilities: ["mycelium-might"],
        hiddenAbility: null,
        baseStats: {
          hp: 80,
          atk: 70,
          def: 65,
          spa: 80,
          spd: 120,
          spe: 100,
        },
      };
    case "Orthworm":
      return {
        name,
        types: ["steel"],
        abilities: ["earth-eater"],
        hiddenAbility: "sand-veil",
        baseStats: {
          hp: 70,
          atk: 85,
          def: 145,
          spa: 60,
          spd: 55,
          spe: 65,
        },
      };
    case "Clodsire":
      return {
        name,
        types: ["poison", "ground"],
        abilities: ["poison-point", "water-absorb"],
        hiddenAbility: "unaware",
        baseStats: {
          hp: 130,
          atk: 75,
          def: 60,
          spa: 45,
          spd: 100,
          spe: 20,
        },
      };
    case "Farigiraf":
      return {
        name,
        types: ["normal", "psychic"],
        abilities: ["cud-chew", "armor-tail"],
        hiddenAbility: "sap-sipper",
        baseStats: {
          hp: 120,
          atk: 90,
          def: 70,
          spa: 110,
          spd: 70,
          spe: 60,
        },
      };
    case "Bombirdier":
      return {
        name,
        types: ["flying", "dark"],
        abilities: ["big-pecks", "keen-eye"],
        hiddenAbility: "rocky-payload",
        baseStats: {
          hp: 70,
          atk: 103,
          def: 85,
          spa: 60,
          spd: 85,
          spe: 82,
        },
      };
    case "Mabosstiff":
      return {
        name,
        types: ["dark"],
        abilities: ["intimidate", "guard-dog"],
        hiddenAbility: "stakeout",
        baseStats: {
          hp: 80,
          atk: 120,
          def: 90,
          spa: 60,
          spd: 70,
          spe: 85,
        },
      };
    case "Garganacl":
      return {
        name,
        types: ["rock"],
        abilities: ["purifying-salt", "sturdy"],
        hiddenAbility: "clear-body",
        baseStats: {
          hp: 100,
          atk: 100,
          def: 130,
          spa: 45,
          spd: 90,
          spe: 35,
        },
      };
    case "Lycanroc": // Midnight form because bulkier
      return {
        name,
        types: ["rock"],
        abilities: ["keen-eye", "sand-rush", "vital-spirit", "tough-claws"],
        hiddenAbility: "steadfast, no-guard",
        baseStats: {
          hp: 85,
          atk: 115,
          def: 75,
          spa: 55,
          spd: 75,
          spe: 82,
        },
      };
    case "Cetitan":
      return {
        name,
        types: ["ice"],
        abilities: ["thick-fat", "slush-rush"],
        hiddenAbility: "sheer-force",
        baseStats: {
          hp: 170,
          atk: 113,
          def: 65,
          spa: 45,
          spd: 55,
          spe: 73,
        },
      };
    case "Ceruledge":
      return {
        name,
        types: ["fire", "ghost"],
        abilities: ["flash-fire"],
        hiddenAbility: "weak-armor",
        baseStats: {
          hp: 75,
          atk: 125,
          def: 80,
          spa: 60,
          spd: 100,
          spe: 85,
        },
      };
    case "Pawmot":
      return {
        name,
        types: ["electric", "fighting"],
        abilities: ["volt-absorb", "natural-cure"],
        hiddenAbility: "iron-fist",
        baseStats: {
          hp: 70,
          atk: 115,
          def: 70,
          spa: 70,
          spd: 60,
          spe: 105,
        },
      };
    case "Kingambit":
      return {
        name,
        types: ["dark", "steel"],
        abilities: ["defiant", "supreme-overlord"],
        hiddenAbility: "pressure",
        baseStats: {
          hp: 100,
          atk: 135,
          def: 120,
          spa: 60,
          spd: 85,
          spe: 50,
        },
      };
    case "Dondozo":
      return {
        name,
        types: ["water"],
        abilities: ["unaware", "oblivious"],
        hiddenAbility: "water-veil",
        baseStats: {
          hp: 150,
          atk: 100,
          def: 115,
          spa: 65,
          spd: 65,
          spe: 35,
        },
      };
    case "Dachsbun":
      return {
        name,
        types: ["fairy"],
        abilities: ["well-baked-body"],
        hiddenAbility: "aroma-veil",
        baseStats: {
          hp: 57,
          atk: 80,
          def: 115,
          spa: 50,
          spd: 80,
          spe: 95,
        },
      };
    case "Maushold":
      return {
        name,
        types: ["normal"],
        abilities: ["friend-guard", "cheek-pouch"],
        hiddenAbility: "technician",
        baseStats: {
          hp: 74,
          atk: 75,
          def: 70,
          spa: 65,
          spd: 75,
          spe: 111,
        },
      };
    case "Revavroom":
      return {
        name,
        types: ["steel", "poison"],
        abilities: ["overcoat"],
        hiddenAbility: "filter",
        baseStats: {
          hp: 80,
          atk: 119,
          def: 90,
          spa: 54,
          spd: 67,
          spe: 90,
        },
      };
    case "Klawf":
      return {
        name,
        types: ["rock"],
        abilities: ["anger-shell", "shell-armor"],
        hiddenAbility: "regenerator",
        baseStats: {
          hp: 70,
          atk: 100,
          def: 115,
          spa: 35,
          spd: 55,
          spe: 75,
        },
      };
    case "Annihilape":
      return {
        name,
        types: ["fighting", "ghost"],
        abilities: ["vital-spirit", "inner-focus"],
        hiddenAbility: "defiant",
        baseStats: {
          hp: 110,
          atk: 115,
          def: 80,
          spa: 50,
          spd: 90,
          spe: 90,
        },
      };
    case "Glimmora":
      return {
        name,
        types: ["rock", "poison"],
        abilities: ["toxic-debris"],
        hiddenAbility: "corrosion",
        baseStats: {
          hp: 83,
          atk: 55,
          def: 90,
          spa: 130,
          spd: 81,
          spe: 86,
        },
      };
    case "Baxcalibur":
      return {
        name,
        types: ["dragon", "ice"],
        abilities: ["thermal-exchange"],
        hiddenAbility: "ice-body",
        baseStats: {
          hp: 115,
          atk: 145,
          def: 92,
          spa: 75,
          spd: 86,
          spe: 87,
        },
      };
    default:
      return null;
  }
};
