import { createMenu } from "./menu";
import { progressBar } from "./utils/progress-bar";

type Download = {
  customState?: string;
  fileName: string;
  progress: number;
  speed: number;
};

export function createDownloadManager() {
  let downloads: Download[] = [];

  const menu = createMenu({
    id: "downloads",
    items: [],
    height: 5,
    onSelect: () => {},
  });

  function add(fileName: string, customState: string = "") {
    downloads = [
      { customState, fileName, progress: 0, speed: 0 },
      ...downloads,
    ];
  }

  function update(fileName: string, progress: number, speed: number) {
    const index = downloads.findIndex(
      (download) => download.fileName === fileName
    );
    if (index < 0) return;

    downloads[index].progress = progress;
    downloads[index].speed = speed;
  }

  function render() {
    const items = downloads.map((download) => {
      const isComplete = download.progress >= 1;
      let status = isComplete
        ? "complete"
        : `${progressBar(download.progress)} ${Math.floor(
            download.progress * 100
          )}%    ${download.speed?.toFixed(2) || "?"} Mb/s `;

      return {
        meta: {},
        title: `${strWidth(download.fileName, 36)}   ${
          download.customState || status
        }`,
      };
    });

    menu.setItems(items);
    menu.render(false);
  }

  return { render, add, update };
}

function strWidth(str: string, size: number) {
  if (str.length >= size) {
    return str.slice(0, size);
  }
  const space = Array.from(Array(size - str.length))
    .fill(" ")
    .join("");
  return `${str}${space}`;
}
