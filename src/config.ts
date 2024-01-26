const defaultConfig = (path: string) => ({
  folder: "archives",
  collections: {
    add: "empty",
    collections: "empty",
    to: "empty",
    [path]: "empty",
  },
});

function loadConfig(path: string) {
  let config;

  async function load() {
    try {
      const buffer = await Switch.readFile(path);

      return JSON.parse(new TextDecoder().decode(buffer));
    } catch (e) {
      const config = defaultConfig(path);
      Switch.writeFileSync(path, JSON.stringify(config, null, 2));
      return config;
    }
  }

  async function get(key: string) {
    if (config) {
      return config[key];
    }
    config = await load();
    return config[key];
  }

  return { get };
}

export const config = loadConfig("sdmc:/config/nx-archive-browser/config.json");
