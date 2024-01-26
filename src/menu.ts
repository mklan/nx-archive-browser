import { red, blue, green, white, bold, bgRed } from "kleur/colors";

export type Item = {
  title: string;
  meta: Record<string, any>;
  marked?: boolean;
};

type menuOptions = {
  items: Item[];
  height: number;
  id: string;
  onSelect: (item: Item) => void;
};

export function createMenu(opts: menuOptions) {
  let { items, height, id, onSelect } = opts;
  let selected = 0;

  function fillSpace() {
    if (items.length < height) {
      Array.from(Array(height - items.length)).forEach(() => console.log());
    }
  }

  function getId() {
    return id;
  }

  function setItems(newItems: Item[]) {
    items = newItems;
  }

  function render(highlightSelected = true) {
    let start = 0;
    let end = height;

    if (selected >= height / 2) {
      start = selected - height / 2;
      end = selected + height / 2;

      if (end >= items.length - 1) {
        start = items.length - 1 - height;
        end = items.length - 1;
      }
    }

    // debug console.log(selected, before, after)

    items.slice(start, end).forEach((item, i) => {
      if (highlightSelected && item.title === items[selected].title) {
        // console.warn('>', item.title);
        console.warn(item.title);
      } else if (item.marked) {
        console.log(green(item.title));
      } else {
        console.log(item.title);
      }
    });

    fillSpace();

    if (items.length && highlightSelected)
      console.log(`\n${selected + 1}/${items.length}`);
  }

  function next(steps = 1) {
    selected += steps;
    if (selected > items.length - 1) {
      selected = steps > 1 ? items.length - 1 : 0;
    }
  }

  function prev(steps = 1) {
    selected -= steps;
    if (selected < 0) selected = steps > 1 ? 0 : items.length - 1;
  }

  function getSelected() {
    return items[selected];
  }

  function getNext() {
    let next = selected + 1;
    if (next > items.length - 1) {
      next = 0;
    }
    return items[next];
  }

  function getPrev() {
    let prev = selected - 1;
    if (prev < 0) {
      prev = items.length - 1;
    }
    return items[prev];
  }

  function select(id?: number) {
    const item = items[id || selected];
    onSelect(item);
  }

  return {
    getSelected,
    getNext,
    getPrev,
    select,
    next,
    prev,
    render,
    setItems,
    getId,
  };
}
