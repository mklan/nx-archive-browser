export function getTitles(x: number) {
  return Array.from(Array(x)).map((_, i) => ({
    fileName: `title${i}.zip`,
    title: `title${i}`,
    date: "none",
    size: 20,
  }));
}
