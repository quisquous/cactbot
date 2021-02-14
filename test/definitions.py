"""Standard definitions shared across the Cactbot Python tests."""

from enum import Enum, auto
from pathlib import Path

# ./../../
PROJECT_ROOT_DIRECTORY = Path(__file__).parent.parent

# Filesystem variables
DATA_DIRECTORY = "data"
TEST_DIRECTORY = "test"
UI_DIRECTORY = "ui"
MANIFEST_FILENAME = "manifest.txt"
NODE_COMMAND = "node --experimental-specifier-resolution=node --loader ts-node/esm".split()


class CactbotModule(Enum):
    """Enumeration of Cactbot modules.

    Enumeration of Cactbot modules where the value is arbitrary and automatically assigned. Enum
    elements can be listed in alphabetical order, as they would appear in a filesystem.
    """

    def directory(self):
        """Get the module's base directory.

        Returns:
            The module's base directory as a pathlib.Path object.
        """
        return Path(PROJECT_ROOT_DIRECTORY, UI_DIRECTORY, str(self.name).lower())

    DPS = auto()
    EUREKA = auto()
    FISHER = auto()
    JOBS = auto()
    OOPSYRAIDSY = auto()
    PULLCOUNTER = auto()
    RAIDBOSS = auto()
    TEST = auto()
