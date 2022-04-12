import webpack from 'webpack';

// Note: the timeline files are displayed/translated inside of the config,
// and so we shouldn't simplify them here by stripping comments and blank lines.
export default function(this: webpack.LoaderContext<never>, content: string): string {
  this.cacheable(true);
  return content;
}
