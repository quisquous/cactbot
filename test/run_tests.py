"""Aggregate test runner for Cactbot Python tests."""

import sys
import test_manifests

if __name__ == "__main__":
    EXIT_STATUS = test_manifests.main()
    sys.exit(EXIT_STATUS)
