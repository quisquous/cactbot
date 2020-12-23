"""Validates the integrity of the manifest files and data directories for Cactbot modules."""

import asyncio
from pathlib import Path
import subprocess
import sys
from definitions import PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY

UNITTEST_DIRECTORY = "unittests"

UNITTEST_TEST_DIRECTORY = Path(PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY, UNITTEST_DIRECTORY)


async def run(files):
    procs = []

    for f in files:
        procs.append(await asyncio.create_subprocess_exec("node", f))

    await asyncio.gather(*[p.communicate() for p in procs])

    exit_status = 0
    for p in procs:
        exit_status != p.returncode

    return exit_status


def main():
    """Runs unit tests

    Returns:
        An exit status code of 0 or 1 if the tests passed successfully or failed, respectively.
    """
    loop = asyncio.get_event_loop()
    # Run individual unit tests
    files = [str(test_file) for test_file in UNITTEST_TEST_DIRECTORY.iterdir()]
    ret = loop.run_until_complete(run(files))

    return ret


if __name__ == "__main__":
    EXIT_STATUS = main()
    sys.exit(EXIT_STATUS)
