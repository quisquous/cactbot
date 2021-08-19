import { transform } from 'suo-parser';
import { LoaderContext } from 'webpack';

interface AdditionalData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
  // eslint-disable-next-line @typescript-eslint/ban-types
  webpackAST: object;
}

export default function(
  this: LoaderContext<never>,
  content: string,
  map?: string,
  meta?: AdditionalData,
): void {
  this.cacheable(true);
  const callback = this.async();

  transform(content, (err, output) => {
    if (err) {
      callback(err);
      return;
    }

    if (!output) {
      callback(new Error('Invalid timeline file'));
      return;
    }

    callback(null, output, map, meta);
  });
}
