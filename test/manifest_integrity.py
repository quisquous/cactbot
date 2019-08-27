"""Validates the integrity of the manifest files and data directories for Cactbot modules."""

from pathlib import Path
import sys

DATA_DIRECTORY = 'data'
MANIFEST_FILENAME = 'manifest.txt'


def main():
    """Validates the integrity of the manifest file against the files within the data directory.

    Validation includes checking if all of the files listed in the manifest are present in the
    module's expected data directory, and if all of the files in the expected data directory have
    a corresponding entry within the module's manifest.

    Returns:
        An exit status code of 0 or 1 if the tests passed successfully or failed, respectively.
    """
    exit_status = 0

    # TODO: Only goes two directories up -- makes assumptions about project structure
    project_root_dir = Path(__file__).parent.parent

    # Find all manifest files within the project scope
    for manifest_filepath in Path(project_root_dir).rglob(f'**/{MANIFEST_FILENAME}'):
        # Specifically target manifest files within their respective data directories
        data_directory = manifest_filepath.parent
        if not data_directory.name == DATA_DIRECTORY:
            continue

        # Extract expected manifest files from manifest
        manifest_entries = get_manifest_entries(manifest_filepath)

        # Get actual list of files within current directory
        data_files = get_data_directory_files(data_directory)

        # Error on any unlisted data files
        for file in [_ for _ in data_files if _ not in manifest_entries]:
            print(f'Error: Found unlisted file {file} in directory {data_directory} that does not '
                  f'exist within manifest.')
            exit_status = 1

        # Error on any missing data files
        for file in [_ for _ in manifest_entries if _ not in data_files]:
            print(f'Error: Entry for {file} found within manifest, but no corresponding file '
                  f'found within directory {data_directory}.')
            exit_status = 1

    return exit_status


def get_manifest_entries(manifest_filepath):
    """Get all the entries within the manifest at the provided filepath.

    Parse the manifest provided and return a list of all entry strings, formatted to be in the
    expected format, including operating system specific folder separators.

    Args:
        manifest_filepath: Path to the module's manifest to be parsed.

    Returns:
        A list of properly formatted manifest entry strings.
    """
    manifest_entries = []

    for entry in manifest_filepath.read_text().splitlines():
        # Skip empty lines
        if not entry:
            continue
        manifest_entries.append(str(Path(entry)))

    return manifest_entries


def get_data_directory_files(root_directory):
    """Recursively get all the files within the provided root directory.

    Get all of the files below the specified directory and return a list of filepath strings in
    the expected module manifest format.

    Args:
        root_directory: Root directory to recursively walk through.

    Returns:
        A list of properly formatted filepath strings.
    """
    data_files = []

    # Manifest files only contain .js or .txt files
    for extension in ['js', 'txt']:
        for file in root_directory.glob(f'**/*.{extension}'):
            # Filter manifest or README files from the result set
            if not file.stem or file.stem in ['manifest', 'README']:
                continue
            # Match the expected file format listed within the manifest
            data_files.append(str(file.relative_to(root_directory)))

    return data_files


if __name__ == '__main__':
    EXIT_STATUS = main()
    sys.exit(EXIT_STATUS)
