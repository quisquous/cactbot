import UserConfig from '../../resources/user_config';
import chai from 'chai';

const { assert } = chai;

describe('config tests', () => {
  it('user files are sorted correctly', () => {
    const unsortedKeys = [
      'b but with some spaces/file.js',
      'b/subdir1/z/z/z/nested_file.js',
      'a/some.js',
      'root_file1.js',
      'zzz/sleepy.js',
      'B/subDir2/second.js',
      'b/some_file.js',
      'b/subdir1/file.js',
      'root_file2.js',
      'a/some file with spaces oof why.js',
      'b/subdir2/first.js',
    ];
    const sortedKeys = [
      'a/some.js',
      'a/some file with spaces oof why.js', // sorted by filename ignoring extension
      'b/subdir1/z/z/z/nested_file.js',
      'b/subdir1/file.js',
      'b/subdir2/first.js',
      'B/subDir2/second.js',
      'b/some_file.js',
      'b but with some spaces/file.js',
      'zzz/sleepy.js',
      'root_file1.js',
      'root_file2.js',
    ];

    assert.deepEqual(UserConfig.sortUserFiles(unsortedKeys), sortedKeys);
  });

  it('user files are filtered correctly', () => {
    const keys = [
      'ignoreme/raidboss/ignored.js',
      'oopsyraidsy/turnoffjunk/raidboss.js',
      'oopsyraidsy/turnoffjunk/stuff.js',
      'raidboss/mystatic/subfolder/raidboss.js',
      'raidboss/mystatic/strat1.js',
      'raidboss/MyStatic/strat2.js',
      'raidboss/my other space static/yikes.js',
      'raidboss/nicelookingtriggers/script.js',
      'raidboss/nicelookingtriggers/style.js',
      'raidboss/prettytimelines/something.css',
      'raidboss/prettytimelines/something else.css',
      'ignored_root_file.js',
      'oopsyraidsy.js',
      'RADAR.js',
      'radar.CSS',
      'raidbossy.js',
      'raidboss.js',
      'raidboss.css',
      'raidboss.html',
      'yet another ignored file with spaces.js',
    ];

    assert.deepEqual(UserConfig.filterUserFiles(keys, 'radar', '.js'), ['RADAR.js']);
    assert.deepEqual(UserConfig.filterUserFiles(keys, 'radar', '.css'), ['radar.CSS']);
    assert.deepEqual(UserConfig.filterUserFiles(keys, 'config', '.js'), []);
    assert.deepEqual(UserConfig.filterUserFiles(keys, 'oopsyraidsy', '.js'), [
      'oopsyraidsy/turnoffjunk/raidboss.js',
      'oopsyraidsy/turnoffjunk/stuff.js',
      'oopsyraidsy.js',
    ]);
    assert.deepEqual(UserConfig.filterUserFiles(keys, 'oopsyraidsy', '.css'), []);
    assert.deepEqual(UserConfig.filterUserFiles(keys, 'raidboss', '.js'), [
      'raidboss/mystatic/subfolder/raidboss.js',
      'raidboss/mystatic/strat1.js',
      'raidboss/MyStatic/strat2.js',
      'raidboss/my other space static/yikes.js',
      'raidboss/nicelookingtriggers/script.js',
      'raidboss/nicelookingtriggers/style.js',
      'raidboss.js',
    ]);
    assert.deepEqual(UserConfig.filterUserFiles(keys, 'raidboss', '.css'), [
      'raidboss/prettytimelines/something.css',
      'raidboss/prettytimelines/something else.css',
      'raidboss.css',
    ]);
  });
});
