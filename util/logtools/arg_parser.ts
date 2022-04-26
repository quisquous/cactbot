import argparse from 'argparse';

type TimelineArgs = {
  [index: string]: string | number | boolean | undefined;
  'file'?: string;
  'force'?: boolean;
  'search_fights'?: number;
  'search_zones'?: number;
  'fight_regex'?: string;
  'zone_regex'?: string;
  'adjust'?: number;
};

class LogUtilArgParse {
  parser = new argparse.ArgumentParser({
    addHelp: true,
  });
  // At least one non-file argument must be selected from this group.
  fileGroup = this.parser.addArgumentGroup({
    title: 'File Args',
    description: 'A file and/or a timeline must be selected before performing operations',
  });
  // Exactly one argument should be selected from this group.
  requiredGroup = this.parser.addMutuallyExclusiveGroup();
  args: TimelineArgs;

  constructor() {
    this.fileGroup.addArgument(['-f', '--file'], {
      help: 'Network log file to analyze',
    });
    this.fileGroup.addArgument(['-t', '--timeline'], {
      help: 'The filename of the timeline to test against, e.g. ultima_weapon_ultimate',
    });
    this.parser.addArgument(['--force'], {
      nargs: '?',
      constant: true,
      help: 'Overwrite files when exporting',
    });
    this.requiredGroup.addArgument(['-lf', '--search-fights'], {
      nargs: '?',
      constant: -1,
      type: 'int',
      help: 'Fight in log to export, e.g. \'1\'. ' +
        'If no number is specified, returns a list of fights.',
    });
    this.requiredGroup.addArgument(['-lz', '--search-zones'], {
      nargs: '?',
      constant: -1,
      type: 'int',
      help: 'Zone in log to export, e.g. \'1\'. ' +
        'If no number is specified, returns a list of zones.',
    });
    this.requiredGroup.addArgument(['-fr', '--fight-regex'], {
      nargs: '?',
      constant: -1,
      type: 'string',
      help: 'Export all fights that match this regex',
    });
    this.requiredGroup.addArgument(['-zr', '--zone-regex'], {
      nargs: '?',
      constant: -1,
      type: 'string',
      help: 'Export all zones that match this regex',
    });
    this.requiredGroup.addArgument(['-a', '--adjust'], {
      nargs: '?',
      constant: 0,
      type: 'float',
      help: 'Adjust all entries in a timeline file by this amount',
    });
    this.args = this.parser.parseArgs() as TimelineArgs;
  }
}

export { LogUtilArgParse, TimelineArgs };
