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
  // At least one argument must be selected from this group.
  fileGroup = this.parser.addArgumentGroup({
    title: 'File Args',
    description: 'A file and/or a timeline must be selected before performing operations',
  });
  // Exactly one argument should be selected from this group.
  // All arguments within this group are defined with nargs: '?',
  // so the user can call them from the command line with or without values.
  // This way, in any consuming script, a value of null means that argument
  // is not present at the command line.

  // While exactly one argument should be called from this group,
  // which ones are valid will vary on a per-script basis,
  // so we leave that level of validation to the consuming scripts.
  // The only validation done here is to ensure that at least one
  // of these arguments is present.
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
