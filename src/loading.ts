import { createScreen } from "./screen";

export const loading = (() => {
  let msg = "loading...";
  let isLoading = false;

  const screen = createScreen(80, 22);

  return {
    start: (text: string) => {
      msg = text;
      isLoading = true;
    },
    stop: () => (isLoading = false),
    render: () => {
      console.log(screen.centerTextVert(msg));
    },
    isLoading: () => isLoading,
  };
})();
