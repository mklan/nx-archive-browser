# nx-archive-browser

Browse and download archives from archive.org on your Nintendo Switch

<img src="https://github.com/mklan/NX-Rom-Market/raw/main/screenshot.jpg" width="600" />


## Install

1. copy the nx-archive-browser.nro into the `/switch` folder on your SD card. The app will appear on the Homebrew Menu.

2. Configure your archive collections and root download folder in `config/nx-archive-browser/config.json`.
The keys represent collection folders inside your download folder. The values are archive.org identifier of collections.

Example:

```Json
{
  "folder": "roms",
  "collections": {
    "N64": "SomeCollectionByGhostw***",
    "SNES": "SomeOtherCollectionByGhostw***"
  }
}
```

The archives will be downloaded to `sdmc:/roms/N64` and `sdmc:/roms/SNES`.

Read the [legal terms](https://archive.org/about/terms.php) of archive.org. I would encourage you to only download games you developed on your own or in some cases own a copy of the original product (depends where you are located). 

## Credits

[TooTallNate - nxjs](https://github.com/TooTallNate/nx.js) - JS runtime for the Switch


## Possible TODOs

- [ ] cancel downloads
- [ ] search
- [ ] external meta-lists [top, popular]
- [ ] metadata [in-game screenshot, description]
- [ ] unzip

## LICENSE

MIT License

Copyright (c) 2021 - 2024 Matthias Klan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
