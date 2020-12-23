"""Tests individual trigger files for the raidboss Cactbot module."""

import asyncio
from pathlib import Path
import subprocess
import sys
from definitions import CactbotModule, DATA_DIRECTORY, PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY

TRIGGER_DIRECTORY = "trigger"

TRIGGER_TEST_DIRECTORY = Path(PROJECT_ROOT_DIRECTORY, TEST_DIRECTORY, TRIGGER_DIRECTORY)


async def run(proc_list):
    processes = [await p for p in proc_list]
    await asyncio.gather(*[p.communicate() for p in processes])

    exit_status = 0
    for proc in processes:
        exit_status != proc.returncode

    return exit_status


def main():
    """Validates individual trigger files within the raidboss Cactbot module.

    Current validation only checks that the trigger file successfully compiles.

    Returns:
        An exit status code of 0 or 1 if the tests passed successfully or failed, respectively.
    """
    loop = asyncio.get_event_loop()
    async_process_list = []

    for filepath in Path(CactbotModule.RAIDBOSS.directory(), DATA_DIRECTORY).glob("**/*.js"):
        # Run individual trigger tests
        for test_file in TRIGGER_TEST_DIRECTORY.iterdir():
            async_process_list.append(
                asyncio.create_subprocess_exec("node", str(test_file), str(filepath))
            )

    exit_status = loop.run_until_complete(run(async_process_list))
    return exit_status


if __name__ == "__main__":
    EXIT_STATUS = main()
    sys.exit(EXIT_STATUS)
