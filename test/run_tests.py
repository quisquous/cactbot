"""Aggregate test runner for Cactbot Python tests."""

import sys
import test_manifests
import test_triggers

if __name__ == "__main__":
    EXIT_STATUS = test_manifests.main()
    EXIT_STATUS |= test_triggers.main()
    sys.exit(EXIT_STATUS)
