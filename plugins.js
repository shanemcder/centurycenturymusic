// Source releases available on the Software page.
const plugins = [
  {
    name: "ChordPalette",
    type: "MIDI plugin / Composition",
    description: "Explore chord voicings, trigger harmonies, and export MIDI while you write. Includes a Logic MIDI FX plugin and a Player build.",
    status: "Source release / v0.1",
    downloadUrl: "downloads/chordpalette-v0.1.zip",
    screenshot: "assets/software/chordpalette.png",
    screenshotWidth: 1350,
    screenshotHeight: 1020,
    screenshotAlt: "ChordPalette Player interface"
  },
  {
    name: "TempoLock",
    type: "Standalone app / Timing",
    description: "Analyze recordings, work with beat anchors, and export audio at a target tempo. An experimental tool for shaping the timing of recorded performances.",
    status: "Experimental source / v1.3",
    downloadUrl: "downloads/tempolock-v1.3.zip",
    screenshot: "assets/software/tempolock.png",
    screenshotWidth: 1420,
    screenshotHeight: 829,
    screenshotAlt: "TempoLock v1.3 app interface"
  },
  {
    name: "Patina",
    type: "Audio effect / Texture",
    description: "Add liquid movement, drifting pitch, dark echoes, and diffuse space to instruments, loops, and vocals.",
    status: "Source release / v0.2",
    downloadUrl: "downloads/patina-v0.2.zip",
    screenshot: "assets/software/patina.png",
    screenshotWidth: 1530,
    screenshotHeight: 1095,
    screenshotAlt: "Patina v0.2 audio effect interface"
  }
];

const catalog = document.getElementById("plugin-catalog");

for (const plugin of plugins) {
  const card = document.createElement("article");
  card.className = "plugin";

  const top = document.createElement("div");
  top.className = "plugin-top";
  const type = document.createElement("span");
  type.className = "plugin-type";
  type.textContent = plugin.type;
  const status = document.createElement("span");
  status.className = "status";
  status.textContent = plugin.status;
  top.append(type, status);

  const name = document.createElement("h2");
  name.textContent = plugin.name;
  const description = document.createElement("p");
  description.textContent = plugin.description;
  const footer = document.createElement("div");
  footer.className = "plugin-footer";

  if (plugin.downloadUrl) {
    const link = document.createElement("a");
    link.className = "download";
    link.href = plugin.downloadUrl;
    link.textContent = "Download source";
    link.setAttribute("download", "");
    footer.append(link);
  } else {
    const disabled = document.createElement("span");
    disabled.className = "download";
    disabled.setAttribute("aria-disabled", "true");
    disabled.textContent = "Download coming soon";
    footer.append(disabled);
  }

  const copy = document.createElement("div");
  copy.className = "plugin-copy";
  copy.append(top, name, description, footer);

  const figure = document.createElement("figure");
  figure.className = "plugin-screenshot";
  const preview = document.createElement("a");
  preview.href = plugin.screenshot;
  preview.target = "_blank";
  preview.rel = "noopener noreferrer";
  preview.setAttribute("aria-label", "View full " + plugin.name + " screenshot");
  const image = document.createElement("img");
  image.src = plugin.screenshot;
  image.alt = plugin.screenshotAlt;
  image.width = plugin.screenshotWidth;
  image.height = plugin.screenshotHeight;
  image.loading = "lazy";
  image.decoding = "async";
  preview.append(image);
  const caption = document.createElement("figcaption");
  caption.textContent = "Click to view interface";
  figure.append(preview, caption);

  card.append(copy, figure);
  catalog.append(card);
}
