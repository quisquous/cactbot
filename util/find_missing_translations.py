import argparse
import io
import os
import re
import subprocess

# Directory names to ignore when looking for JavaScript files.
ignore_dirs = [
    ".git",
    "publish",
    "ThirdParty",
    "node_modules",
]

# All valid two letter locale names.
all_locales = set(["en", "cn", "de", "fr", "ja", "ko"])

# Locales that are in zoneRegex object blocks.
zoneregex_locales = set(["en", "cn", "ko"])

# Locales that are not in zoneRegex object blocks.
non_zoneregex_locales = all_locales - zoneregex_locales

# Where to start looking for files.
def base_path():
    return os.path.relpath(os.path.join(os.path.dirname(__file__), "..\\"))


# Return a list of all javascript filenames found under base_path()
def find_all_javascript_files(filter):
    python_files = []
    for root, dirs, files in os.walk(base_path()):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]

        for file in files:
            if not file.endswith(".js"):
                continue
            full_path = os.path.join(root, file)
            if filter not in full_path:
                continue
            python_files.append(full_path)
    return python_files


# Print missing translations in |file| for |locales|
# TODO: should this just be in javascript with the rest of the tests?
def parse_javascript_file(file, locales):
    locales = set(locales)

    with open(file, encoding="utf-8") as fp:
        keys = []
        open_match = None

        open_obj_re = re.compile(r"(\s*)(.*{)\s*")
        key_re = re.compile(r"\s*(\w\w):")

        for idx, line in enumerate(fp):
            # Any time we encounter what looks like a new object, start over.
            # FIXME: this deliberately simplifies and will ignore nested objects.
            # That's what we get for parsing javascript with regex.
            m = open_obj_re.fullmatch(line)
            if m:
                open_match = m
                # idx is zero-based, but line numbers are not.
                line_number = idx + 1
                keys = []
                continue

            # If we're not inside an object, keep looking for the start of one.
            if not open_match:
                continue

            # If this object is ended with the same indentation,
            # then we've probably maybe found the end of this object.
            if re.match(open_match.group(1) + "}", line):
                # Check if these keys look like a translation block.
                if "en" in keys:
                    missing_keys = locales - set(keys)

                    open_str = open_match.group(2)
                    # Only some locales care about zoneRegex, so special case.
                    if open_str == "zoneRegex: {":
                        missing_keys -= non_zoneregex_locales

                    if missing_keys:
                        err = file + ":" + str(line_number)
                        err += ' "' + open_str + '"'
                        if len(locales) > 1:
                            err += " " + str(list(missing_keys))
                        print(err)
                open_match = None
                continue

            # If we're inside an object, find anything that looks like a key.
            key_match = key_re.match(line)
            if key_match:
                keys.append(key_match.group(1))


def parse_trigger_file_for_timelines(file, locale):
    find_missing_timeline_js = os.path.join(
        os.path.dirname(__file__), "find_missing_timeline_translations.js"
    )

    # Process stdout ourselves so that it interleaves incorrectly.
    cmd = ["node", find_missing_timeline_js, str(file), locale]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    for line in io.TextIOWrapper(proc.stdout, encoding="utf-8"):
        print(line.rstrip().encode("ascii", "backslashreplace").decode())


if __name__ == "__main__":
    example_usage = ""

    parser = argparse.ArgumentParser(
        description="Prints out a list of missing translations",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "-l", "--locale", help="The locale to find missing translations for, e.g. de"
    )
    parser.add_argument(
        "-f", "--filter", help="Limits the results to only match specific files/path"
    )
    args = parser.parse_args()

    if not args.locale:
        raise parser.error("Missing required locale.")
    if not args.locale in all_locales:
        raise parser.error("Invalid locale: " + args.locale)
    locales = [args.locale]
    if not args.filter:
        args.filter = ""

    for file in find_all_javascript_files(args.filter):
        parse_trigger_file_for_timelines(file, args.locale)
        parse_javascript_file(file, locales)
