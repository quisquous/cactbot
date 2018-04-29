#!/usr/bin/python
from __future__ import print_function
import argparse
import re

time_re = re.compile(r"^\s*#?\s*([0-9]+(?:\.[0-9]+)?)\s+\"")
first_num_re = re.compile(r"([0-9]+(?:\.[0-9]+)?)")


def adjust_lines(lines, adjust):
  for line in lines:
    match = re.match(time_re, line)
    if match:
      time = float(match.group(1)) + adjust
      print(re.sub(first_num_re, str(time), line, 1), end='')
    else:
      print(line, end='')

def main():
  parser = argparse.ArgumentParser(
      description="A utility to uniformly adjust times in an act timeline file")
  parser.add_argument('--file', required=True, type=argparse.FileType('r', encoding="utf8"),
      help="The timeline file to adjust times in")
  parser.add_argument('--adjust', required=True, type=float,
      help="The amount of time to adjust each entry by")

  args = parser.parse_args()
  adjust_lines(args.file, args.adjust)


if __name__ == "__main__":
  main()
