# A temporary wrapper for check_regex_translation.js
# See note in that file for what this script is doing.
import argparse
import io
import os
import re
import subprocess


# All valid two letter locale names.
all_locales = set(["en", "cn", "de", "fr", "ja", "ko"])


def base_path():
    return os.path.relpath(os.path.join(os.path.dirname(__file__), "..\\ui\\raidboss\\data\\"))


def find_all_javascript_files():
    python_files = []
    for root, dirs, files in os.walk(base_path()):
        for file in files:
            if file.endswith(".js"):
                python_files.append(os.path.join(root, file))
    return python_files


def parse_trigger_file_for_timelines(file, locale):
    find_missing_timeline_js = os.path.join(os.path.dirname(__file__), "check_regex_translation.js")

    cmd = ["node", find_missing_timeline_js, str(file), locale]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    for line in io.TextIOWrapper(proc.stdout, encoding="utf-8"):
        print(line.rstrip().encode("ascii", "backslashreplace").decode())


if __name__ == "__main__":
    example_usage = ""

    parser = argparse.ArgumentParser(
        description="Prints out mismatched translations between locale regex and timelineReplace",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument(
        "-l", "--locale", help="The locale to find mismatched translations for, e.g. de"
    )
    args = parser.parse_args()

    if not args.locale:
        raise parser.error("Missing required locale.")
    if not args.locale in all_locales:
        raise parser.error("Invalid locale: " + args.locale)
    locales = [args.locale]

    for file in find_all_javascript_files():
        parse_trigger_file_for_timelines(file, args.locale)
