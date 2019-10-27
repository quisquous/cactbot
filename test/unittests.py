"""Validates the integrity of the manifest files and data directories for Cactbot modules."""

from pathlib import Path
import subprocess
import sys
from definitions import  PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY

UNITTEST_DIRECTORY = 'unittests'

UNITTEST_TEST_DIRECTORY = Path(PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY, UNITTEST_DIRECTORY)


def main():
    """Runs unit tests

    Returns:
        An exit status code of 0 or 1 if the tests passed successfully or failed, respectively.
    """
    exit_status = 0
    
    # Run individual unit tests
    for test_file in UNITTEST_TEST_DIRECTORY.iterdir():
        exit_status |= subprocess.call(['node', str(test_file)])

    return exit_status


if __name__ == '__main__':
    EXIT_STATUS = main()
    sys.exit(EXIT_STATUS)
