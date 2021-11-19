import argparse from 'argparse';

type argsObject = {
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
  args: argsObject;
  constructor() {
    this.parser.addArgument(['-f', '--file'], {
      required: true,
      help: 'Network log file to analyze',
    });
    this.parser.addArgument(['--force'], {
      nargs: 0,
      help: 'Overwrite files when exporting',
    });
    this.parser.addArgument(['-lf', '--search-fights'], {
      nargs: '?',
      constant: -1,
      type: 'int',
      help: 'Fight in log to use, e.g. \'1\'. ' +
        'If no number is specified, returns a list of fights.',
    });
    this.parser.addArgument(['-lz', '--search-zones'], {
      nargs: '?',
      constant: -1,
      type: 'int',
      help: 'Zone in log to use, e.g. \'1\'. ' +
        'If no number is specified, returns a list of zones.',
    });
    this.parser.addArgument(['-fr', '--fight-regex'], {
      nargs: '?',
      constant: '*',
      type: 'string',
      help: 'Export all fights that match this regex',
    });
    this.parser.addArgument(['-zr', '--zone-regex'], {
      nargs: '?',
      constant: '*',
      type: 'string',
      help: 'Export all zones that match this regex',
    });
    this.parser.addArgument(['-a', '--adjust'], {
      nargs: '?',
      constant: 0,
      type: 'float',
      help: 'Adjust all entries in a timeline file by this amount',
    });
    this.args = this.validate(this.parser.parseArgs() as argsObject);
  }

  validate(args: argsObject): argsObject {
    let numExclusiveArgs = 0;
    for (const opt of ['search_fights', 'search_zones', 'fight_regex', 'zone_regex']) {
      if (args[opt] !== null)
        numExclusiveArgs++;
    }
    if (numExclusiveArgs > 1) {
      console.error('Error: Must specify exactly zero or one of -lf, -lz, -fr\n');
      process.exit(-1);
    }
    return args;
  }
}

export default TimelineParse;
