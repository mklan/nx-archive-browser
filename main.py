# pylint: disable=no-member disable=import-error disable=no-name-in-module
from provider import ArchiveOrg

from pathlib import Path
import threading
import imgui
import os
import runpy
import sys
import time
import string
import traceback
import urllib.request
import urllib.parse
import zipfile
import json

import _nx
import imguihelper
from imgui.integrations.nx import NXRenderer
from nx.utils import clear_terminal


def colorToFloat(t):
    nt = ()
    for v in t:
        nt += ((1/255) * v, )
    return nt


def hexToFloat(h):
    rgb = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
    return colorToFloat(rgb)


COLLECTION_COLOR = hexToFloat('1d1d1d')  # gray
ROM_COLOR = hexToFloat('1d1d1d')  # gray
ROM_COLOR_DOWNLOADED = hexToFloat('A17723')  # yellow
MENU_BUTTON_COLOR = hexToFloat('367588')  # blue
MENU_BUTTON_COLOR_SELECTED = hexToFloat('A17723')  # yellow
TEXT_COLOR = hexToFloat('e2e2e2')  # light gray

ERROR = ""

TILED_DOUBLE = 1


# Progress Bar---------------------------------------
# source: https://github.com/hotshotz79/NX-RomGet
def report_hook(count, block_size, total_size):
    global start_time
    if count == 0:
        start_time = time.time()
        return
    duration = time.time() - start_time
    progress_size = int(count * block_size)
    speed = int(progress_size / (1024 * duration))
    percent = min(int(count*block_size*100/total_size), 100)
    sys.stdout.write("\r...%d%%, %d / %d MB, %d KB/s, %d seconds passed" %
                     (percent, progress_size / (1024 * 1024), total_size / (1024 * 1024), speed, duration))
    # sys.stdout.write("\rPercent: %d%% | Downloaded: %d of %d MB | Speed: %d KB/s | Elapsed Time: %d seconds" %
    #                (percent, progress_size / (1024 * 1024), total_size / (1024 * 1024), speed, duration))
    sys.stdout.flush()


# source: https://github.com/hotshotz79/NX-RomGet
def start(rom, consolefolder, extract):
    # clear both buffers
    imguihelper.clear()
    _nx.gfx_set_mode(TILED_DOUBLE)
    clear_terminal()

    filename = rom['title']
    zippath = os.path.splitext(filename)[0]

    print("-------------------------------------------------------------------------------")
    print("\n            _   _ __   __     ______                _____      _   " +
          "\n           | \ | |\ \ / /     | ___ \              |  __ \    | |  " +
          "\n           |  \| | \ V /______| |_/ /___  _ __ ___ | |  \/ ___| |_ " +
          "\n           | . ` | /   \______|    // _ \| '_ ` _ \| | __ / _ \ __|" +
          "\n           | |\  |/ /^\ \     | |\ \ (_) | | | | | | |_\ \  __/ |_ " +
          "\n           \_| \_/\/   \/     \_| \_\___/|_| |_| |_|\____/\___|\__|")
    print("\n-------------------------------------------------------------------------------\n")
    print("\n[Rom Selected]  " + filename)
    print("\n[Download Path] sdmc:/Roms/" + consolefolder + "/")
    print("\n-------------------------------------------------------------------------------\n")
    print("Download Progress:\n")
    urllib.request.urlretrieve(
        rom['link'], "sdmc:/Roms/" + consolefolder + "/" + filename, report_hook)
    print("\n\n File Downloaded")

    # TODO extraction info is not printed
    # Extraction Section
    if extract:
        print("\n-------------------------------------------------------------------------------\n")
        print("\n[Extraction Path] sdmc:/Roms/" +
              consolefolder + "/" + filename + "/")
        print("Extraction Progress:\n")
        path_to_extract = "sdmc:/Roms/" + consolefolder + "/" + zippath
        zf = zipfile.ZipFile("sdmc:/Roms/" + consolefolder + "/" + filename)
        uncompress_size = sum((file.file_size for file in zf.infolist()))
        extracted_size = 0

        i = len(zf.infolist())
        x = 1

        for file in zf.infolist():
            extracted_size += file.file_size
            print("Extracting " + str(x) + " of " + str(i) + ": " + file.filename + " | Size: " + str(file.file_size /
                                                                                                      1000000)[0:5] + " MB | Progress: " + str((extracted_size * 100/uncompress_size))[0:3] + "%")
            zf.extractall(path_to_extract)
            x += 1

    imguihelper.initialize()


def fetch_roms(collection, prefix):
    try:
        roms = ArchiveOrg.fetch(collection)
    except Exception:
        roms = []

    def alphaFilter(rom): return rom['title'].upper().startswith(prefix)
    def numFilter(rom): return rom['title'][0].isdigit()

    filtered_roms = list(
        filter(prefix == '#' and numFilter or alphaFilter, roms))
    return filtered_roms


def rom_list(collections, console_selected, prefix='A', checkbox_extract=False):
    # clear both buffers
    imguihelper.clear()
    _nx.gfx_set_mode(TILED_DOUBLE)
    clear_terminal()
    imguihelper.initialize()

    renderer = NXRenderer()

    # TODO fetcing indicator
    roms = fetch_roms(collections[console_selected], prefix)

    # create collection rom folder
    directory = "Roms"
    parent_dir = "sdmc:/"
    path = os.path.join(parent_dir, directory, console_selected)
    try:
        os.makedirs(path, exist_ok=True)
    except OSError as error:
        print("Directory '%s' can not be created" % path)

    os.chdir(path)
    dir_content = os.listdir()

    while True:

        renderer.handleinputs()

        imgui.new_frame()

        width, height = renderer.io.display_size
        imgui.set_next_window_size(width, height)
        imgui.set_next_window_position(0, 0)
        imgui.begin("",
                    flags=imgui.WINDOW_NO_TITLE_BAR | imgui.WINDOW_NO_RESIZE | imgui.WINDOW_NO_MOVE | imgui.WINDOW_NO_SAVED_SETTINGS
                    )

        imgui.begin_group()

        imgui.push_style_color(imgui.COLOR_BUTTON, *MENU_BUTTON_COLOR_SELECTED)
        if imgui.button("< Back", width=70, height=50):
            main(collections)
        imgui.pop_style_color(1)

        imgui.same_line(spacing=50)
        _, checkbox_extract = imgui.checkbox(
            "EXTRACT .ZIP AFTER DOWNLOAD", checkbox_extract)

        imgui.text("Collection: " + console_selected)

        imgui.new_line()

        for letter in '#'+string.ascii_uppercase:

            button_color = MENU_BUTTON_COLOR_SELECTED if prefix == letter else MENU_BUTTON_COLOR

            imgui.same_line()
            imgui.push_style_color(imgui.COLOR_BUTTON, *button_color)
            if imgui.button(letter, width=28, height=28):
                rom_list(collections, console_selected,
                         letter, checkbox_extract)
            imgui.pop_style_color(1)

        imgui.new_line()
        imgui.begin_child("region", -0, -0, border=True)

        for rom in roms:
            folder_name = os.path.splitext(rom['title'])[0]
            is_downloaded = any(x in dir_content for x in [
                rom['title'], folder_name])
            button_color = ROM_COLOR_DOWNLOADED if is_downloaded else ROM_COLOR
            imgui.push_style_color(imgui.COLOR_BUTTON, *button_color)
            if imgui.button(rom['title']+"  "+rom['size'], width=1240, height=30):
                start(rom, console_selected, checkbox_extract)
            imgui.pop_style_color(1)

        imgui.end_child()

        imgui.end_group()

        imgui.end()

        imgui.render()
        renderer.render()

    renderer.shutdown()


def main(collections):

    global ERROR
    renderer = NXRenderer()

    while True:
        renderer.handleinputs()

        imgui.new_frame()

        width, height = renderer.io.display_size
        imgui.set_next_window_size(width, height)
        imgui.set_next_window_position(0, 0)
        imgui.begin("",
                    flags=imgui.WINDOW_NO_TITLE_BAR | imgui.WINDOW_NO_RESIZE | imgui.WINDOW_NO_MOVE | imgui.WINDOW_NO_SAVED_SETTINGS
                    )

        imgui.push_style_color(imgui.COLOR_TEXT, *TEXT_COLOR)
        imgui.push_style_color(imgui.COLOR_BUTTON_HOVERED, *MENU_BUTTON_COLOR)
        imgui.push_style_color(imgui.COLOR_BUTTON_ACTIVE, *MENU_BUTTON_COLOR)
        imgui.begin_group()

        imgui.text("NX-Rom-Market")

        # Create ROMS folder if it doesn't exist
        directory = "Roms"
        parent_dir = "sdmc:/"
        path = os.path.join(parent_dir, directory)
        try:
            os.makedirs(path, exist_ok=True)
        except OSError as error:
            print("Directory '%s' can not be created" % directory)

        for idx, collectionName in enumerate(sorted([*collections])):

            idx % 3 == 0 and imgui.new_line() or imgui.same_line()

            imgui.push_style_color(imgui.COLOR_BUTTON, *COLLECTION_COLOR)
            if imgui.button(collectionName, width=390, height=150):
                rom_list(collections, collectionName)
            imgui.pop_style_color(1)

        imgui.end_group()

        imgui.end()

        if ERROR:
            imgui.set_next_window_size(width, height)
            imgui.set_next_window_position(0, 0)
            imgui.begin("ERROR",
                        flags=imgui.WINDOW_NO_RESIZE | imgui.WINDOW_NO_MOVE | imgui.WINDOW_NO_SAVED_SETTINGS
                        )
            imgui.text(str(ERROR))
            if imgui.button("OK", width=200, height=60):
                ERROR = ""
            imgui.end()

        imgui.render()
        renderer.render()

    renderer.shutdown()


if __name__ == "__main__":

    # hacky way to load collections and display errors in a weird way.
    # I am sure the exception handling could be done better
    try:
        try:
            with open('collections.json') as json_file:
                try:
                    collections = json.load(json_file)
                except Exception:
                    collections = {
                        'Wrong JSON Format! Check collections.json': ''}
        except Exception:
            collections = {
                'collections.json not found!': ''}
        main(collections)
    except Exception:
        imguihelper.clear()
        imguihelper.clear()
        _nx.gfx_set_mode(TILED_DOUBLE)
        clear_terminal()
        traceback.print_exc(file=open("sdmc:/switch/NX-Roms/errlog.txt", "a"))
