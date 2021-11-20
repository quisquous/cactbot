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

class TimelineParse {
  parser = new argparse.ArgumentParser({
    addHelp: true,
  });
  // At least one non-file argument must be selected from this group.
  fileGroup = this.parser.addArgumentGroup({
    title: 'File Args',
    description: 'A file and/or a timeline must be selected before performing operations',
  });
  // Exactly one argument should be selected from this group.
  requiredGroup = this.parser.addMutuallyExclusiveGroup({ required: true });
  args: TimelineArgs;

  constructor() {
    this.fileGroup.addArgument(['-f', '--file'], {
      help: 'Network log file to analyze',
    });
    this.fileGroup.addArgument(['-t', '--timeline'], {
      help: 'The filename of the timeline to test against, e.g. ultima_weapon_ultimate',
    });
    this.parser.addArgument(['--force'], {
      nargs: 0,
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
      nargs: '1',
      type: 'string',
      help: 'Export all fights that match this regex',
    });
    this.requiredGroup.addArgument(['-zr', '--zone-regex'], {
      nargs: '1',
      type: 'string',
      help: 'Export all zones that match this regex',
    });
    this.requiredGroup.addArgument(['-a', '--adjust'], {
      nargs: '?',
      constant: 0,
      type: 'float',
      help: 'Adjust all entries in a timeline file by this amount',
    });
    this.args = this.validate(this.parser.parseArgs() as TimelineArgs);
  }

  validate(args: TimelineArgs): TimelineArgs {
    // We can't enforce 1+ arguments in a non-exclusive group,
    // so we have to do it manually here.
    let numFileArgs = 0;
    for (const opt of ['file', 'timeline']) {
      if (args[opt] !== null)
        numFileArgs++;
    }
    if (numFileArgs === 0) {
      console.error('Error: Must specify at least one of -f or -t');
      process.exit(-1);
    }
    return args;
  }
}

export { TimelineArgs, TimelineParse };
