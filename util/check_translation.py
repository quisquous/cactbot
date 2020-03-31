# Checks a trigger file and timeline for translations.

# TODO: this does not handle multi-line regexes.  You have to join them before running this.  <_<

import argparse
import json
import os
import re

languages = ["en", "de", "fr", "ja", "cn", "ko"]
regex_entries = {
    "regexEn": "en",
    "regexDe": "de",
    "regexFr": "fr",
    "regexJa": "ja",
    "regexCn": "cn",
    "regexKo": "ko",
}


class FileLikeArray:
    def __init__(self, lines):
        self.lines = lines
        self.max_lines = len(lines)
        self.idx = 0
        self.out = []
        self.last_line = None

    def readline(self):
        # readline just peeks at next line, and any
        # writes that occur will come before it, so
        # append it here.
        if self.last_line:
            self.out.append(self.last_line)
            self.last_line = None
        if self.idx >= self.max_lines:
            return None
        self.last_line = self.lines[self.idx]
        self.idx += 1
        return self.last_line

    def skipline(self):
        self.last_line = None

    def write(self, line):
        self.out.append(line)


def base_triggers_path():
    return os.path.join(os.path.dirname(__file__), "../ui/raidboss/data/")


def construct_relative_triggers_path(filename):
    return os.path.join(base_triggers_path() + filename)


def translate_regex(regex, trans):
    line = regex
    # Can't just compare if old == new as some things use the same name in
    # multiple languages, but we still want to output a regex for that
    # language to show that it's been translated.

    did_work = False
    effectLines = [
        "gains the effect",
        "loses the effect",
        "gainsEffect",
        "losesEffect",
    ]
    for effectLine in effectLines:
        if line.find(effectLine):
            for old, new in trans["~effectNames"].items():
                did_work = did_work or re.search(old, line)
                line = re.sub(old, new, line)
            break
    for old, new in trans["replaceText"].items():
        did_work = did_work or re.search(old, line)
        line = re.sub(old, new, line)
    for old, new in trans["replaceSync"].items():
        did_work = did_work or re.search(old, line)
        line = re.sub(old, new, line)

    if did_work:
        return line


def update_triggers(triggers, trans):
    fp = FileLikeArray(triggers)
    base_regex = r"^\s*regex:\s*(.*?),\s*$"

    line = fp.readline()
    accum_line = None
    while line:
        # process trigger block separately
        if line.startswith("  triggers: ["):
            line = fp.readline()
            regex_langs = {}
            found_base = None

            # while we don't hit the end of the trigger block
            while line and not line.startswith("  ]"):
                # See if line has any regexes on it.  Assume base regex: comes first.
                if line.find("regex:") != -1:
                    m = re.match(base_regex, line)
                    if m:
                        found_base = m
                        fp.skipline()
                    else:
                        raise Exception("Unparseable base regex: " + line)
                if found_base:
                    for regex, lang in regex_entries.items():
                        if line.find(regex + ":") != -1:
                            regex_langs[lang] = line
                            fp.skipline()
                # once a non-regex line is hit, then write all regexes in sorted order,
                # starting with the base.
                if found_base and line.find("regex") == -1:
                    fp.write(found_base.group(0))
                    for lang in sorted(languages):
                        if lang in regex_langs:
                            fp.write(regex_langs[lang])
                            continue
                        if lang in trans:
                            new_regex = translate_regex(found_base.group(1), trans[lang])
                            if new_regex:
                                new_line = f"      regex{lang.capitalize()}: {new_regex},\n"
                                fp.write(new_line)

                    regex_langs = {}
                    found_base = None

                line = fp.readline()
        line = fp.readline()
    return fp.out


def parse_translations(triggers):
    fp = FileLikeArray(triggers)

    # go go parsing javascript in python.
    # We could arguably run node.js here and use it to parse the js, buuuut <_<
    # oh god this whole section is a terrible hack, I'm so, so sorry.
    lines = ["["]
    line = fp.readline()
    while line:
        if line.startswith("  timelineReplace: [") or line.startswith('  "timelineReplace": ['):
            line = fp.readline()
            while line and not line.startswith("  ]"):
                awful_json_trailing_comma_check = False
                line = line.strip()

                # remove comments (assume no comments in strings)
                line = re.sub(r"\s*//.*$", "", line)
                # fix unquoted/single-quoted Javascript keys and properties <_<
                line = re.sub(r"^([^:\"\'](?:\s*[^:\"\'])*)(\s*:)", r'"\1"\2', line)
                line = re.sub(r"^\s*'([^:\"\'](?:\s*.)*?)'(\s*:)", r'"\1"\2', line)
                line = re.sub(r"(:\s?)'(.*)',", r'\1"\2",', line)
                # hackily handle escaped single quotes
                line = re.sub(r"\\'", "'", line)
                if line.endswith(","):
                    awful_json_trailing_comma_check = True
                    line = line[:-1]
                lines.append(line)
                line = fp.readline()
                if not re.match(r"^\s*[}\]]", line) and awful_json_trailing_comma_check:
                    lines.append(",")
        line = fp.readline()

    lines.append("]")
    try:
        ret_list = json.loads("".join(lines))
    except json.decoder.JSONDecodeError as e:
        print("Error json format:{}".format("".join(lines)))
        raise e

    ret_dict = {}
    for entry in ret_list:
        add_if_missing = [
            "replaceText",
            "replaceSync",
            "~effectNames",
        ]
        for key in add_if_missing:
            if key not in entry:
                entry[key] = {}
        ret_dict[entry["locale"]] = entry
    return ret_dict


def translate_timeline(line, trans):
    if not re.match(r"\s*[0-9.]+\s+", line):
        return line

    # handle replace text first
    did_work = False
    replace_text_re = re.compile(r'"[^"]*"')
    m = replace_text_re.search(line)
    if not m:
        return line
    text = m.group(0)
    for old, new in trans["replaceText"].items():
        did_work = did_work or re.search(old, text)
        text = re.sub(old, new, text)
    line = replace_text_re.sub(text, line)
    skip_text = [
        "--sync--",
        "--Reset--",
        "Start",
    ]
    for skip in skip_text:
        did_work = did_work or re.search(skip, text, re.IGNORECASE)
    if not did_work:
        line = line + " #MISSINGTEXT"

    did_work = False
    replace_sync_re = re.compile(r"sync /([^/]*)/")
    escape_backslash_re = re.compile(r"(?<!\\)\\(?!\\)")
    m = replace_sync_re.search(line)
    if not m:
        return line
    text = m.group(1)
    for old, new in trans["replaceSync"].items():
        did_work = did_work or re.search(old, text, re.IGNORECASE)
        text = re.sub(old, new, text)
        # Double escape any escaped characters that will break the
        # regex below.  The regex substitution will turn the
        # double backslashes back into single backslashes.
        # Not doing this causes a "bad escape" in the re engine.
        text = escape_backslash_re.sub(r"\\\\", text)
    line = replace_sync_re.sub("sync /%s/" % text, line)
    if not did_work:
        line = line + " #MISSINGSYNC"

    return line


def print_timeline(locale, timeline_file, trans, missing_filter):
    if not locale in trans:
        raise Exception("no translation for " + locale)
    with open(timeline_file, encoding="utf-8") as fp:
        for line in fp.readlines():
            filter_print_timeline(translate_timeline(line.strip(), trans[locale]), missing_filter)


def filter_print_timeline(text, missing_filter):
    if missing_filter == "all":
        if " #MISSINGSYNC" in text or " #MISSINGTEXT" in text:
            print(text)
    elif missing_filter == "sync":
        if " #MISSINGSYNC" in text:
            print(text)
    elif missing_filter == "text":
        if " #MISSINGTEXT" in text:
            print(text)
    else:
        print(text)


def main(args):
    filename = construct_relative_triggers_path(args.file)
    # Try to use it explicitly if the short name doesn't exist.
    if not os.path.exists(filename):
        filename = args.file
    # Allow for just specifying the base filename, e.g. "o12s.js"
    if not os.path.exists(filename):
        for root, dirs, files in os.walk(base_triggers_path()):
            if filename in files:
                filename = os.path.join(root, filename)
                break
    if not os.path.exists(filename):
        raise FileNotFoundError('Could not find file "%s"' % filename)

    with open(filename, "r", encoding="utf-8") as fp:
        lines = fp.readlines()

    trans = parse_translations(lines)

    if args.timeline:
        for line in lines:
            m = re.search(r"timelineFile:\s*'(.*?)',", line)
            if m:
                timeline_dir = os.path.dirname(filename)
                timeline_file = os.path.join(timeline_dir, m.group(1))
                print_timeline(args.timeline, timeline_file, trans, args.grep_missing)
                return
        raise Exception("unable to find timelineFile in %s" % args.file)

    # ...otherwise update triggers.
    updated = update_triggers(lines, trans)

    # deliberately write utf-8 here, as git treats utf-16 as binary
    # and this is a huge pain.
    with open(filename, "w", encoding="utf-8") as fp:
        fp.write("".join(updated))


if __name__ == "__main__":
    example_usage = ""

    parser = argparse.ArgumentParser(
        description="Rewrites the translation of a trigger/timeline file",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    parser.add_argument("-f", "--file", help="The trigger file name, e.g. o5s.js")
    parser.add_argument(
        "-t", "--timeline", help="If passed, print out the timeline for a locale, e.g. de"
    )
    parser.add_argument(
        "-gm",
        "--grep-missing",
        help="Filters -t for [all] missing elements, [text] only #MISSINGTEXT or [sync] only #MISSINGSYNC",
    )

    args = parser.parse_args()

    if not args.file:
        raise parser.error("Must pass a file.")
    if args.timeline and not args.timeline in languages:
        raise parser.error("Must pick a valid language: %s" % ", ".join(languages))

    # TODO: add an option to write to a different file instead of rewriting
    # TODO: add missing entries (from timelines?) to translations
    # TODO: warn if there are name conflicts (a match and b match, but if apply a then b doesn't apply)

    main(args)
