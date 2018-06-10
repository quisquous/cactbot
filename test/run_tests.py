import os
import re
import subprocess
import sys

def base_directory():
  return os.path.join(os.path.dirname(__file__), '..');

def triggers_directory():
  return os.path.join(base_directory(), 'ui/raidboss/data/triggers/');

def compile_test(filename):
  err = subprocess.call(['node', filename])
  return err == 0

def run_compilation_tests():
  success = True
  dir = triggers_directory()
  for filename in os.listdir(dir):
    if filename.endswith('.js'):
      success &= compile_test(os.path.join(dir, filename))
  return success

def run_timeline_tests():
  err = subprocess.call(['node',
      os.path.join(base_directory(), 'test/check_timelines.js')])
  return err == 0

def main():
  success = run_compilation_tests() and run_timeline_tests()
  if not success:
    sys.exit(1);
  sys.exit(0);

if __name__ == "__main__":
    main()
