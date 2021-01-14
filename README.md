# NX-Rom-Market

Browse and download roms on your Nintendo Switch

> :warning: **This App does not provide any roms! Sources need to be added manually**

<img src="https://github.com/mklan/NX-Rom-Market/raw/main/inapp.gif" width="600" />

## Providers

currently only https://archive.org is available.

PRs for new providers + a provider-manager are appreciated

## Install

1. Copy the content of the ZIP archive of a release into the /switch folder on your SD card. NX-Rom-Market will appear on the Homebrew Menu.

2. Configure your rom collections in `collections.json`. The keys represent rom folders inside `sdmc:/roms/` the values are archive.org identifier of rom collections.

Example:

```Json
{
  "N64": "SomeRomCollectionByGhostw***",
  "SNES": "SomeOtherCollectionByGhostw***"
}
```

The Roms will be downloaded to `sdmc:/roms/N64` and `sdmc:/roms/SNES`.

Read the [legal terms](https://archive.org/about/terms.php) of archive.org. I would encourage you to only download games you developed on your own or in some cases own a copy of the original product (depends where you are located). 

## Limitations

- No SSL! PyNX does not support ssl so keep in mind that you are downloading via an unencrypted connection. Ideally use a VPN. Although archive.org seems to redirect download requests to some external bucket, so it could be a different scenario (please correct me if I am wrong)

- You cannot go back to Homebrew Menu. You have to press the Home button to close the app

- You can currently only download one rom at a time. Also the download will block the ui thread, so you cannot continue browsing. I tried threading, but it crashed (PR pls!).

## Known Bugs

- no zip extraction info is being displayed. Just wait until the script returns to the list again.

## Credits

[PyNX](https://github.com/nx-python/PyNX) - Python ecosystem for the Switch

[NX-RomGet](https://github.com/hotshotz79/NX-RomGet) - Download / Extract script

## Backlog

- [ ] download-queue
- [ ] cancel downloads
- [ ] delete roms
- [ ] search
- [ ] external meta-lists [top, popular]
- [ ] manage providers
- [ ] metadata [in-game screenshot, description]
- [ ] loading collection indicator

## LICENSE

MIT License

Copyright (c) 2021 Matthias Klan

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
