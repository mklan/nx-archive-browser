export function createScreen(width: number = 80, height: number = 44) {
  const clearScreen = [...Array(height).fill("")].join("\n");

  function pad(str: string, amount: number) {
    return space(amount) + str;
  }

  function space(amount: number) {
    return Array.from(Array(amount)).fill(" ").join("");
  }

  function centerText(str: string) {
    const amount = Math.floor((width - str.length) / 2);
    return pad(str, amount);
  }

  type SpreadPart = {
    text: string;
    color: (input: string) => string;
  };

  type SpreadOpts = {
    left: SpreadPart;
    center: SpreadPart;
    right: SpreadPart;
  };

  function spread2({ left, right }: Omit<SpreadOpts, "center">) {
    const amount = width - left.text.length - right.text.length;

    return `${left.color(left.text)}${space(amount)}${right.color(right.text)}`;
  }

  function spread3({ left, center, right }: spreadOpts) {
    const spaceToCenter =
      Math.floor((width - center.text.length) / 2) - left.text.length;

    const leftPart = left.text;
    const centerPart = pad(center.text, spaceToCenter);

    const spaceFromCenterPart =
      width - leftPart.length - centerPart.length - right.text.length;
    const rightPart = pad(right.text, spaceFromCenterPart);

    return `${left.color(leftPart)}${center.color(centerPart)}${right.color(
      rightPart
    )}`;
  }

  function right(str: string, padding: number = 0) {
    const padLeft = width - str.length - padding;
    return pad(str, padLeft);
  }

  /** @remark currently only one line */
  function centerTextVert(str: string) {
    const text = centerText(str);
    const padding = [...Array(Math.floor(height / 2)).fill("")].join("\n");
    return `${padding}
    ${text}
    ${padding}`;
  }

  function clear() {
    console.log(clearScreen);
  }

  return { centerText, centerTextVert, clear, right, spread2, spread3 };
}
