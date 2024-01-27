import { red, cyan, green, white, yellow, bgRed } from "kleur/colors";

import { cursor, erase } from "sisteransi";
import { createDownloadManager } from "./download-manager";
import { fetchProgress } from "./fetch";
import { input } from "./input";
import { createMenu, Item } from "./menu";
import { createScreen } from "./screen";
import { download, fetchArchiveList } from "./services/archive.service";
import { notification } from "./utils/notification";
import { config } from "./config";
import { loading } from "./loading";

type Collection = {
  title: string;
  archiveName: string;
};

const VISIBLE_MENU_ITEMS = 22;

let currentMenu;
let mainMenu;
let currentCollection;

let isButtonDownPressed = false;
let isButtonUpPressed = false;

const downloadManager = createDownloadManager();
const screen = createScreen(80, 43);

const header = screen.spread3({
  left: { text: "", color: white },
  center: { text: "nx-archive-browser v0.1.2", color: yellow },
  right: { text: "+ Exit ", color: white },
});

async function main() {
  // init local-storage to get the profile prompt directly on start
  localStorage.setItem("init", "true");

  const collections = await config.get("collections");

  const collectionItems: Item[] = Object.entries(collections).map(
    ([title, archiveName]) => ({
      title,
      meta: {
        title,
        archiveName,
      },
    })
  );

  mainMenu = createMenu({
    id: "main",
    items: collectionItems,
    height: VISIBLE_MENU_ITEMS,
    onSelect: async (item) => {
      try {
        await enterCollection(item.meta as Collection, () => {
          currentMenu = mainMenu!;
        });
        currentCollection = item.meta.title;
      } catch (e) {
        loading.stop();
        notification.show(4000, "Error loading collection");
        currentMenu = mainMenu!;
      }
    },
  });
  currentMenu = mainMenu;

  requestAnimationFrame(loop);

  let timeout;
  input({
    onButtonDown: (key: string) => {
      if (loading.isLoading()) return;
      if (key === "up") {
        currentMenu!.prev();
        timeout = setTimeout(() => {
          isButtonUpPressed = true;
        }, 500);
      }
      if (key === "down") {
        currentMenu!.next();

        timeout = setTimeout(() => {
          isButtonDownPressed = true;
        }, 500);
      }
      if (key === "left") {
        currentMenu!.prev(VISIBLE_MENU_ITEMS);
      }
      if (key === "right") {
        currentMenu!.next(VISIBLE_MENU_ITEMS);
      }
      if (key === "L") {
        if (currentMenu!.getId() === "collection") {
          mainMenu!.prev();
          mainMenu!.select();
        }
      }
      if (key === "R") {
        if (currentMenu!.getId() === "collection") {
          mainMenu!.next();
          mainMenu!.select();
        }
      }
      if (key === "A") {
        currentMenu!.select();
      }
      if (key === "B") {
        currentMenu = mainMenu!;
      }
      if (key === "Y") {
        localStorage && localStorage.clear();
        notification.show(2000, "cache cleared!");
      }
      if (key === "X") {
        if (currentMenu!.getId() === "collection") {
          const item = currentMenu!.getSelected();
          if (!item.marked) return;

          remove(item.meta.collection.title, item.meta.fileName);
          item.marked = false;
        }
      }
    },
    onButtonUp: (key: string) => {
      if (loading.isLoading()) return;
      if (key === "up") {
        clearTimeout(timeout!);

        isButtonUpPressed = false;
      }
      if (key === "down") {
        clearTimeout(timeout!);

        isButtonDownPressed = false;
      }
    },
  });
}

async function listLocalFiles(collection: string) {
  const folder = await config.get("folder");
  return Switch.readDirSync(`sdmc:/${folder}/${collection}`) || [];
}

async function remove(collection: string, fileName: string) {
  const folder = await config.get("folder");

  const path = `sdmc:/${folder}/${collection}/${fileName}`;
  Switch.removeSync(path);
  notification.show(2000, `${fileName} deleted!`);
}

async function handleDownload(collection: Collection, item: Item) {
  const folder = await config.get("folder");

  try {
    await download(
      collection,
      item.meta.fileName,
      `${folder}/${collection.title}`,
      {
        onDownloadStart: () => {
          downloadManager.add(item.meta.fileName);
        },
        onProgress: (p) => {
          downloadManager.update(item.meta.fileName, p.progress, p.speed);
        },
      }
    );
    item.marked = true;
  } catch (e) {
    downloadManager.add(item.meta.fileName, e as string);
  }
}

async function enterCollection(collection: Collection, onExit: () => void) {
  loading.start(`Fetching collection: ${collection.title} ...`);
  const cached = localStorage.getItem(collection.archiveName);
  const entries = cached
    ? JSON.parse(cached)
    : await fetchArchiveList(collection.archiveName);

  localStorage.setItem(collection.archiveName, JSON.stringify(entries));

  const localFiles = await listLocalFiles(collection.title);

  const titles = entries.map((entry) => ({
    meta: {
      fileName: entry.fileName,
      collection,
    },
    marked: localFiles.includes(entry.fileName),
    title: entry.title.slice(0, 79),
  }));

  currentMenu = createMenu({
    id: "collection",
    items: [
      {
        title: "<",
      },
      ...titles,
    ],
    height: VISIBLE_MENU_ITEMS,
    onSelect: (item: Item) => {
      if (item.title === "<") {
        return onExit();
      }
      handleDownload(collection, item);
    },
  });

  loading.stop();
}

function render() {
  console.log(erase.screen);

  console.log(header);

  console.log("");

  if (currentMenu!.getId() === "collection") {
    console.log(
      screen.spread3({
        left: { text: ` L   ${mainMenu!.getPrev().title}`, color: white },
        center: { text: currentCollection!, color: cyan },
        right: { text: `${mainMenu!.getNext().title}   R `, color: white },
      })
    );
  } else {
    console.log("");
    console.log("");
  }
  console.log("");

  if (loading.isLoading()) {
    loading.render();
    console.log("");
  } else {
    currentMenu!.render();
  }

  console.log(screen.right(notification.toString() + " "));
  console.log(
    screen.centerText(
      "__________________________________ Downloads ___________________________________"
    )
  );
  console.log("");

  downloadManager.render();

  console.log(
    "________________________________________________________________________________"
  );

  if (currentMenu!.getId() === "collection") {
    console.log(
      screen.spread2({
        left: { text: " + Nav    A Download    B Home    X Del", color: white },
        right: { text: "github.com/mklan 2024 ", color: white },
      })
    );
  } else {
    console.log(
      screen.spread2({
        left: { text: " + Nav    A Enter    Y clear cache", color: white },
        right: { text: "github.com/mklan 2024 ", color: white },
      })
    );
  }
}

function loop() {
  if (isButtonUpPressed) {
    currentMenu!.prev();
  }
  if (isButtonDownPressed) {
    currentMenu!.next();
  }

  render();
  requestAnimationFrame(loop);
}

main();
