import ArchiveOrg  # pylint: disable=import-error

prefix = 'a'

roms = ArchiveOrg.fetch("GameboyAdvanceRomCollectionByGhostware")
filteredRoms = list(
    filter(lambda rom: rom['title'].lower().startswith(prefix), roms))


for idx, rom in enumerate(filteredRoms):
    print(idx)
    print(rom['link'])
    print(rom['title'])
