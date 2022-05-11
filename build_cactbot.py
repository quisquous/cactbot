#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# coding: utf8
import os
import subprocess
import zipfile
from zipfile import ZipFile
import sys
import shutil

FNULL = open(os.devnull, 'w')
debug_state = True
showTerminal = False


def show_or_hide_terminal(commandarray, shell=False):
    global showTerminal
    commandarray.insert(0, "powershell.exe")
    if showTerminal:
        return subprocess.call(commandarray, shell=shell)
    return subprocess.call(commandarray, shell=shell, stdout=FNULL, stderr=subprocess.STDOUT)


def debug_print(text):
    if debug_state:
        print(text)


def run_fetchDEPS():
    debug_print("Fetch dependencies with build in tools")
    #show_or_hide_terminal(["python", "util/fetch_deps.py"])
    show_or_hide_terminal(["npm", "run", "fetch-deps"])


def check_for_cacbot_dir():
    debug_print("Check if you are already in Cacbot dir!")
    if os.path.exists("./Cactbot.sln"):
        return False
    return True


def navigate_to_cactbot(_state):
    debug_print("Navigate to Cactbot dir")
    dir_path = os.path.dirname(os.path.realpath(__file__))
    os.chdir(dir_path)  # get to a known location
    if _state == "aku":
        if "cactbot_server" not in dir_path:
            os.chdir("./cactbot_server")  # navigate to cactbot dir
    else:
        if "cactbot" not in dir_path:
            os.chdir("./cactbot")  # navigate to cactbot dir
    #cwd = os.getcwd()


def update_cactbot():
    debug_print("Update cactbot to latest version")
    output = show_or_hide_terminal(["git", "pull"])
    if int(output) > 0:
        raise Exception("Something went wrong with updating cactbot!")


def checkout_main():
    debug_print("Cactbot checkout main")
    output = show_or_hide_terminal(["git", "checkout", "main"])
    if int(output) > 0:
        raise Exception("Something went wrong with checking out Cactbot/main!")


def stash_cactbot():
    debug_print("Stash Cactbot to latest version")
    output = show_or_hide_terminal(["git", "stash"])
    if int(output) > 0:
        raise Exception("Something went wrong with stashing Cactbot!")


def build_cacbot_config():
    debug_print("Build cacbot config")
    try:
        #command = ["webpack-cli.cmd", "--config", "webpack/webpack.config.cjs", "--mode", "production"]
        command = ["npm", "run", "build"]
        debug_print(" ".join(command))
        output = show_or_hide_terminal(command, shell=True)
    except Exception:
        output = 9999
    if int(output) > 0:
        raise Exception("Something went wrong with building cactbot!")


def build_cacbot():
    debug_print("Build cacbot")
    try:
        command = ["MSBuild.exe", "plugin/Cactbot.sln", "/property:Configuration=Release", "/property:Platform=x64"]
        debug_print(" ".join(command))
        output = show_or_hide_terminal(command)
    except Exception:
        command = ["C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/MSBuild/Current/Bin/MSBuild.exe", "plugin/Cactbot.sln", "/property:Configuration=Release", "/property:Platform=x64"]
        debug_print(" ".join(command))
        output = show_or_hide_terminal(command)
    if int(output) > 0:
        raise Exception("Something went wrong with building cactbot!")


def publish_cactbot():
    debug_print("Publish cacbot to /publish")
    root_path = "./publish/cactbot-release"
    addon_path = f"{root_path}/addons"
    cacbot_path = f"{root_path}/cactbot"
    # remove old publish build
    shutil.rmtree("./publish", ignore_errors=True)
    # create new folders
    if not os.path.exists(addon_path):
        os.makedirs(addon_path)
    if not os.path.exists(cacbot_path):
        os.makedirs(cacbot_path)
    # Copy all files to theire correct position
    shutil.copy2("./bin/x64/Release/CactbotOverlay.dll", f"{cacbot_path}/CactbotOverlay.dll")
    shutil.copy2("./bin/x64/Release/CactbotEventSource.dll", f"{cacbot_path}/CactbotEventSource.dll")
    #shutil.copytree("./ui", f"{cacbot_path}/ui")
    #shutil.copytree("./resources", f"{cacbot_path}/resources")
    shutil.copytree("./user", f"{cacbot_path}/user")
    #shutil.copytree("./dist", f"{cacbot_path}/dist")
    shutil.copytree("./dist/ui", f"{cacbot_path}/ui")
    shutil.copytree("./dist/resources", f"{cacbot_path}/resources")
    shutil.copy2("./README.md", f"{cacbot_path}/README.md")
    shutil.copy2("./docs/CactbotCustomization.md", f"{cacbot_path}/CactbotCustomization.md")
    shutil.copy2("./CODE_OF_CONDUCT.md", f"{cacbot_path}/CODE_OF_CONDUCT.md")
    shutil.copy2("./CONTRIBUTING.md", f"{cacbot_path}/CONTRIBUTING.md")
    # Navigate into publish for zipping
    os.chdir(f"{root_path}")


def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))


def make_zip():
    debug_print("Create zip file from /publish/cactbot-release")
    with ZipFile('../../cactbot-nightly.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipdir("./", zipf)
    debug_print("File cactbot.zip was created successfully")


def copy_to_act():
    ACT_cacbot_path = "D:/FINAL FANTASY XIV - A Realm Reborn/AdditionalExtern/ACT/Plugins/OverlayPlugin_ngld/cactbot"
    try:
        shutil.rmtree(f"{ACT_cacbot_path}/ui")
        shutil.rmtree(f"{ACT_cacbot_path}/resources")
        # shutil.rmtree(f"{ACT_cacbot_path}/dist")
    except Exception as e:
        debug_print(f"Cannot delete: ({e})")
    try:
        shutil.copy2("./bin/x64/Release/CactbotOverlay.dll", f"{ACT_cacbot_path}/CactbotOverlay.dll")
        shutil.copy2("./bin/x64/Release/CactbotEventSource.dll", f"{ACT_cacbot_path}/CactbotEventSource.dll")
        #shutil.copytree("./ui", f"{ACT_cacbot_path}/ui")
        #shutil.copytree("./resources", f"{ACT_cacbot_path}/resources")
        shutil.copytree("./dist/ui", f"{ACT_cacbot_path}/ui")
        shutil.copytree("./dist/resources", f"{ACT_cacbot_path}/resources")
        shutil.copy2("./README.md", f"{ACT_cacbot_path}/README.md")
        shutil.copy2("./CODE_OF_CONDUCT.md", f"{ACT_cacbot_path}/CODE_OF_CONDUCT.md")
        shutil.copy2("./CONTRIBUTING.md", f"{ACT_cacbot_path}/CONTRIBUTING.md")
        shutil.copy2("./docs/CactbotCustomization.md", f"{ACT_cacbot_path}/CactbotCustomization.md")
        #shutil.copytree("./dist", f"{ACT_cacbot_path}/dist")
        print("Everything was copied over to ACT!")
    except Exception as e:
        debug_print(f"ACT is most likly running ({e})")


def copy_to_oopsy_webserver():
    try:
        oopsy_cacbot_path = r"\\192.168.2.4\Root\var\www\ffxiv\oopsy_summary"
        shutil.copy2("./ui/oopsyraidsy/oopsy_summary.css", f"{oopsy_cacbot_path}/oopsy_summary.css")
        shutil.copy2("./ui/oopsyraidsy/oopsy_common.css", f"{oopsy_cacbot_path}/oopsy_common.css")
        shutil.copy2("./resources/defaults.css", f"{oopsy_cacbot_path}/defaults.css")
        #shutil.copy2("./dist/oopsyraidsy.bundle.js", f"{oopsy_cacbot_path}/oopsyraidsy.bundle.js")
        #shutil.copy2("./dist/oopsyraidsy_data.bundle.js", f"{oopsy_cacbot_path}/oopsyraidsy_data.bundle.js")
        print("Everything was copied over to Oopsy Webserver!")
    except Exception as e:
        debug_print(f"{e}")


def copy_to_raidemulator_webserver():
    try:
        raidemulator_cacbot_path = r"\\192.168.2.4\Root\var\www\ffxiv"
        shutil.copy2("./ui/raidboss/raidemulator.html", f"{raidemulator_cacbot_path}\\raidemulator\\raidemulator.html")
        shutil.copy2("./ui/raidboss/raidemulator.css", f"{raidemulator_cacbot_path}\\raidemulator\\raidemulator.css")
        shutil.copy2("./resources/defaults.css", f"{raidemulator_cacbot_path}\\resources\\defaults.css")
        #shutil.copy2("./dist/raidboss_data.bundle.js", f"{raidemulator_cacbot_path}\\dist\\raidboss_data.bundle.js")
        #shutil.copy2("./dist/raidemulator.bundle.js", f"{raidemulator_cacbot_path}\\dist\\raidemulator.bundle.js")
        #shutil.copy2("./dist/raidemulatorWorker.bundle.js", f"{raidemulator_cacbot_path}\\dist\\raidemulatorWorker.bundle.js")
        print("Everything was copied over to raidemulator Webserver!")
    except Exception as e:
        debug_print(f"{e}")


def copy_cacbot_nightly_zip():
    try:
        oopsy_cacbot_path = r"\\192.168.2.4\Root\var\www\ffxiv"
        shutil.copy2("./cactbot-nightly.zip", f"{oopsy_cacbot_path}/cactbot-nightly.zip")
        print("Zip was copied over to Webserver!")
    except Exception as e:
        debug_print(f"{e}")


def run(state):
    manual_config = False

    global showTerminal
    showTerminal = True
    if check_for_cacbot_dir():
        navigate_to_cactbot(state)
    if not manual_config:
        if not state == "aku":
            stash_cactbot()
            checkout_main()
            update_cactbot()
        run_fetchDEPS()
        build_cacbot_config()
    build_cacbot()
    publish_cactbot()
    make_zip()
    # Navigate into root folder
    os.chdir(f"../../")
    copy_to_act()
    # copy_to_oopsy_webserver()
    # copy_to_raidemulator_webserver()
    copy_cacbot_nightly_zip()


if __name__ == "__main__":
    debug_print("Python version")
    debug_print(sys.version)
    # run(state="rika")
    run(state="aku")
