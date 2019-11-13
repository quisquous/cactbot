"""Aggregate test runner for Cactbot Python tests."""

import sys
import test_manifests
import test_timelines
import test_triggers
import unittests

if __name__ == '__main__':
    EXIT_STATUS = test_manifests.main()
    EXIT_STATUS |= test_timelines.main()
    EXIT_STATUS |= test_triggers.main()
    EXIT_STATUS |= unittests.main()
    sys.exit(EXIT_STATUS)
