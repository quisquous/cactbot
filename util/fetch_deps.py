#!/usr/bin/env python

import sys
import os.path
import json
import shutil
import subprocess
import hashlib
import tarfile
import zipfile
import time

########################################################################################################
## The original script was created by ngld in https://github.com/ngld/OverlayPlugin/tree/master/tools ##
########################################################################################################


def find_basedir():
    base = os.path.abspath(os.path.dirname(__file__))
    tries = 10

    print(base)

    while not os.path.isfile(os.path.join(base, "util", "DEPS.py")):
        base = os.path.dirname(base)
        if not os.path.isdir(base):
            return False

        tries -= 1
        if tries < 1:
            return False

    return base


def safe_rmtree(path):
    tries = 30
    while tries > 0:
        tries -= 1

        try:
            shutil.rmtree(path)
            break
        except Exception:
            if tries <= 0:
                raise

            time.sleep(0.3)


def main(update_hashes=False):
    base = find_basedir()
    scope = {}

    if not base:
        print("ERROR: tools/DEPS.py not found!")
        sys.exit(1)

    deps_path = os.path.join(base, "util", "DEPS.py")
    with open(deps_path, "r") as stream:
        exec(stream.read(), scope)

    deps = scope.get("deps", {})
    cache = {}
    cache_path = os.path.join(base, "util", "DEPS.cache")
    dl_path = os.path.join(base, "util", ".deps_dl")

    if os.path.isfile(cache_path):
        with open(cache_path, "r") as stream:
            cache = json.load(stream)

    old = set(cache.keys())
    new = set(deps.keys())

    missing = new - old
    obsolete = old - new
    outdated = set()

    for key, meta in deps.items():
        if not os.path.isdir(os.path.join(base, meta["dest"])):
            missing.add(key)
        elif (
            "hash" in meta
            and key in old
            and cache[key].get("hash", (None, None))[1] != meta["hash"][1]
        ):
            outdated.add(key)

    if os.path.isdir(dl_path):
        print("Removing left overs...")
        safe_rmtree(dl_path)

    os.mkdir(dl_path)
    rep_map = {}

    try:
        if missing | outdated:
            print("Fetching missing or outdated dependencies...")
            count = len(missing | outdated)
            for i, key in enumerate(missing | outdated):
                print("[%3d/%3d]: %s" % (i + 1, count, key))

                meta = deps[key]
                dlname = os.path.join(dl_path, os.path.basename(meta["url"]).split(".", 1)[1])
                link = meta["url"].split("#")[0]
                dest = os.path.join(base, meta["dest"])

                subprocess.check_call(["curl", "-Lo", dlname, link])

                if "hash" in meta:
                    print("Hashing...")
                    h = hashlib.new(meta["hash"][0])

                    with open(dlname, "rb") as stream:
                        h.update(stream.read(16 * 1024))

                    if update_hashes:
                        rep_map[meta["hash"][1]] = meta["hash"][1] = h.hexdigest()

                    elif h.hexdigest() != meta["hash"][1]:
                        print("ERROR: %s failed the hash check." % key)
                        print("Expected hash: %s" % meta["hash"][1])
                        print("Actual hash: %s" % h.hexdigest())
                        break

                if os.path.isdir(dest):
                    print("Removing old files...")
                    safe_rmtree(dest)

                print("Extracting...")
                if meta["url"].endswith(".zip"):
                    ar_type = "zip"
                    archive = zipfile.ZipFile(dlname)
                    members = [(m.filename, m.is_dir(), m) for m in archive.infolist()]
                elif meta["url"].endswith((".tar.gz", ".tar.xz", ".tgz", ".txz", ".tar")):
                    ar_type = "tar"
                    archive = tarfile.open(dlname)
                    members = [(m.name, m.isdir(), m) for m in archive.getmembers()]
                else:
                    print("ERROR: %s has an unknown archive type!" % meta["url"])
                    continue

                files = len(members)
                for i, (outpath, isdir, member) in enumerate(members):
                    sys.stdout.write("\r%4d / %d    " % (i, files))

                    if meta.get("strip", 0) > 0:
                        outpath = outpath.split("/")
                        if len(outpath) <= meta["strip"]:
                            continue

                        outpath = "/".join(outpath[meta["strip"] :])

                    outpath = os.path.join(dest, outpath)
                    os.makedirs(os.path.dirname(outpath), exist_ok=True)

                    if isdir:
                        if not os.path.isdir(outpath):
                            os.mkdir(outpath)
                    else:
                        with open(outpath, "wb") as stream:
                            if ar_type == "zip":
                                shutil.copyfileobj(archive.open(member), stream)
                            elif ar_type == "tar":
                                shutil.copyfileobj(archive.extractfile(member), stream)

                archive.close()
                sys.stdout.write("\r%4d / %d\n" % (files, files))
                cache[key] = meta

        if obsolete:
            print("Removing old dependencies...")
            count = len(obsolete)
            for i, key in enumerate(obsolete):
                print("[%3d/%3d]: %s" % (i + 1, count, key))

                dest = os.path.join(base, meta["dest"])

                if os.path.isdir(dest):
                    safe_rmtree(dest)

                del cache[key]

        if not missing | outdated | obsolete:
            print("Nothing to do.")

    finally:
        print("Saving dependency cache...")
        with open(cache_path, "w") as stream:
            json.dump(cache, stream)

        if rep_map:
            print("Updating hashes...")
            print(rep_map)

            with open(deps_path, "r") as stream:
                data = stream.read()

            for old, new in rep_map.items():
                data = data.replace(old, new)

            with open(deps_path, "w") as stream:
                stream.write(data)

        print("Cleaning up...")
        safe_rmtree(dl_path)


if __name__ == "__main__":
    main(update_hashes="--update-hashes" in sys.argv)
