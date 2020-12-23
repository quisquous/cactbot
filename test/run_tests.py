"""Aggregate test runner for Cactbot Python tests."""

import concurrent.futures
import sys
import test_manifests
import test_timelines
import test_triggers
import unittests

if __name__ == "__main__":
    EXIT_STATUS = 0
    future_list = []
    with concurrent.futures.ProcessPoolExecutor() as executor:
        future_list.append(executor.submit(test_manifests.main))
        future_list.append(executor.submit(test_manifests.main))
        future_list.append(executor.submit(test_timelines.main))
        future_list.append(executor.submit(test_triggers.main))
        future_list.append(executor.submit(unittests.main))

    for f in future_list:
        EXIT_STATUS != f.result()
    sys.exit(EXIT_STATUS)
