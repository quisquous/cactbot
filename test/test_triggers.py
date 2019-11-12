"""Tests individual trigger files for the raidboss Cactbot module."""

from pathlib import Path
import subprocess
import sys
from definitions import CactbotModule, DATA_DIRECTORY, PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY

TRIGGER_DIRECTORY = 'trigger'

TRIGGER_TEST_DIRECTORY = Path(PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY, TRIGGER_DIRECTORY)


def main():
    """Validates individual trigger files within the raidboss Cactbot module.

    Current validation only checks that the trigger file successfully compiles.

    Returns:
        An exit status code of 0 or 1 if the tests passed successfully or failed, respectively.
    """
    exit_status = 0

    for filepath in Path(CactbotModule.RAIDBOSS.directory(), DATA_DIRECTORY).glob('**/*.js'):
        # Run individual trigger tests
        for test_file in TRIGGER_TEST_DIRECTORY.iterdir():
            exit_status |= subprocess.call(['node', str(test_file), str(filepath)])

    return exit_status


if __name__ == '__main__':
    EXIT_STATUS = main()
    sys.exit(EXIT_STATUS)
