import { red, cyan, green, white, bold, bgRed } from "kleur/colors";

import { createScreen } from "./screen";

const currentCollection = "SNES";

const screen = createScreen(80, 44);

const str = screen.spread("Prev  L", cyan(currentCollection), "R  Next");

console.log(str);

console.log(str.length);
