// import readline from 'readline';

import { Hid } from "nxjs-constants";

const { Button } = Hid;

const readline = {};

export function input({ onButtonDown, onButtonUp }, isNodeJS?: boolean) {
  if (isNodeJS) {
    nodeJSinput({ onButtonDown, onButtonUp });
    return;
  }

  addEventListener("buttondown", (e) => {
    if (e.detail === Button.ZL) {
      onButtonDown("ZL");
    }
    if (e.detail === Button.ZR) {
      onButtonDown("ZR");
    }
    if (e.detail === Button.L) {
      onButtonDown("L");
    }
    if (e.detail === Button.R) {
      onButtonDown("R");
    }
    if (
      [Button.Down, Button.StickLDown, Button.StickRDown].includes(e.detail)
    ) {
      onButtonDown("down");
    }
    if ([Button.Up, Button.StickLUp, Button.StickRUp].includes(e.detail)) {
      onButtonDown("up");
    }
    if (
      [Button.Left, Button.StickLLeft, Button.StickRLeft].includes(e.detail)
    ) {
      onButtonDown("left");
    }
    if (
      [Button.Right, Button.StickLRight, Button.StickRRight].includes(e.detail)
    ) {
      onButtonDown("right");
    }
    if ([Button.A].includes(e.detail)) {
      onButtonDown("A");
    }
    if ([Button.B].includes(e.detail)) {
      onButtonDown("B");
    }
    if ([Button.Y].includes(e.detail)) {
      onButtonDown("Y");
    }
    if ([Button.X].includes(e.detail)) {
      onButtonDown("X");
    }
  });

  addEventListener("buttonup", (e) => {
    if (
      [Button.Down, Button.StickLDown, Button.StickRDown].includes(e.detail)
    ) {
      onButtonUp("down");
    }
    if ([Button.Up, Button.StickLUp, Button.StickRUp].includes(e.detail)) {
      onButtonUp("up");
    }
  });
}

function nodeJSinput({ onButtonDown, onButtonUp }) {
  readline.emitKeypressEvents(process.stdin);

  process.stdin.on("keypress", (ch, { name, ctrl }) => {
    if (name === "up") onButtonDown("up");
    if (name === "down") onButtonDown("down");
    if (name === "a") onButtonDown("A");
    if (ctrl && name === "c") process.exit(1);
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();
}
