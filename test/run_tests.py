"""Aggregate test runner for Cactbot Python tests."""

import sys
import test_manifests
import test_timelines
import test_triggers

if __name__ == '__main__':
    EXIT_STATUS = test_manifests.main() | test_timelines.main() | test_triggers.main()
    sys.exit(EXIT_STATUS)
