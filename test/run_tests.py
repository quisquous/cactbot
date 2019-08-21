import os
import subprocess
import sys


def base_directory():
    return os.path.join(os.path.dirname(__file__), '..')


def triggers_directory():
    return os.path.join(base_directory(), 'ui/raidboss/data/')


def compile_test(filename):
    err = subprocess.call(['node', filename])
    return err == 0


def run_compilation_tests():
    success = True
    dir = triggers_directory()
    for root, dirs, files in os.walk(dir):
        # TODO: maybe this should only check manifest-listed files?
        if 'test' in dirs:
            dirs.remove('test')
        for filename in [f for f in files if f.endswith('.js')]:
            success &= compile_test(os.path.join(root, filename))
    return success


def run_timeline_tests():
    err = subprocess.call(['node',
                           os.path.join(base_directory(), 'test/check_timelines.js')])
    return err == 0


def main():
    success = run_compilation_tests() and run_timeline_tests()
    if not success:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
