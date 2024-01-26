export function progressBar(value: number, size: number = 20) {
  const fill = Math.floor(size * value);

  const filled = Array.from(Array(fill)).reduce((acc) => (acc += "#"), "");
  const empty = Array.from(Array(size - fill)).reduce(
    (acc) => (acc += "_"),
    ""
  );

  return `[${filled}${empty}]`;
}
