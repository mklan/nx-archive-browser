import { parseHTML } from "linkedom";
import { getTitles } from "../mocks";
import { fetchProgress } from "../fetch";

type Collection = {
  title: string;
  archiveName: string;
};

const mock = false;

export async function fetchArchiveList(archiveName: string) {
  if (mock) {
    return getTitles(50);
  }

  return fetch(`https://archive.org/download/${archiveName}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("not found");
      }
      return res.text();
    })
    .then((data) => {
      const dom = parseHTML(data);

      const rows = dom.document.querySelectorAll(
        ".directory-listing-table tbody tr"
      );

      const titles = rows
        .filter((_, i) => i > 0)
        .map((row) => {
          const cells = row.querySelectorAll("td");
          const fileName = cells[0].querySelector("a").href;
          return [
            fileName,
            ...cells.map((cell) =>
              cell.textContent.replace("(View Contents)", "")
            ),
          ];
        })
        .map((title) => ({
          fileName: title[0],
          title: title[1],
          date: title[2],
          size: title[3],
        }));

      return titles;
    });
}

export async function download(
  collection: Collection,
  fileName: string,
  folder: string,
  { onDownloadStart, onProgress }
) {
  const url = `https://archive.org/download/${collection.archiveName}/${fileName}`;

  const blob = await fetchProgress(url, {
    onDownloadStart,
    onProgress,
  }).then((res) => res.blob());

  const buffer = await new Response(blob).arrayBuffer();
  Switch.mkdirSync(`sdmc:/${folder}`);
  Switch.writeFileSync(`sdmc:/${folder}/${fileName}`, buffer);
}
