"""Tests individual timeline files for the raidboss Cactbot module."""

from pathlib import Path
import re
import subprocess
import sys
from definitions import CactbotModule, DATA_DIRECTORY, PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY

TIMELINE_DIRECTORY = "timeline"

TIMELINE_TEST_DIRECTORY = Path(PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY, TIMELINE_DIRECTORY)


def main():
    """Validates individual timeline files within the raidboss Cactbot module.

    Validation includes searching every timeline file in the raidboss data directory for a
    corresponding trigger file, and ensuring that the corresponding trigger file lists the timeline
    file as its `timelineFile` input.

    Returns:
        An exit status code of 0 or 1 if the tests passed successfully or failed, respectively.
    """
    exit_status = 0

    for filepath in Path(CactbotModule.RAIDBOSS.directory(), DATA_DIRECTORY).glob("**/*.txt"):
        # Filter manifest or README files from the result set
        if filepath.stem in ["manifest", "README"]:
            continue

        regex = re.compile(r"^  timelineFile: \'(?P<timelineFile>.*)\',$")

        # Take the existing .txt file and inspect the corresponding .js file with the same name
        try:
            trigger_filename = filepath.with_suffix(".js")
            for line in Path(trigger_filename).read_text(encoding="utf-8").splitlines():
                match = regex.search(line)
                if match:
                    break

            # No timelineFile attribute found within trigger file
            if not match:
                print(
                    f"Error: Trigger file {trigger_filename} has no timelineFile attribute "
                    f"defined."
                )
                exit_status = 1
                continue

            # Found an unexpected timelineFile in the trigger file definition
            if match["timelineFile"] != filepath.name:
                print(
                    f"Error: Trigger file {trigger_filename} has `triggerFile: '{match[1]}'`, but "
                    f"was expecting `triggerFile: '{filepath.name}'`."
                )
                exit_status = 1

        # Timeline file has no trigger file equivalent
        except FileNotFoundError:
            print(f"Error: Timeline file {filepath} found without matching trigger file.")
            exit_status = 1

        # Run individual timeline tests
        for test_file in TIMELINE_TEST_DIRECTORY.iterdir():
            exit_status |= subprocess.call(
                ["node", str(test_file), str(filepath), str(trigger_filename)]
            )

    return exit_status


if __name__ == "__main__":
    EXIT_STATUS = main()
    sys.exit(EXIT_STATUS)
