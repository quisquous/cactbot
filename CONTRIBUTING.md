# Contributing to cactbot

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [Issues and Bug Reports](#issues-and-bug-reports)
* [Pull Requests](#pull-requests)
* [Coding Style](#coding-style)
* [Desired Features](#desired-features)
* [Trigger Guidelines](#trigger-guidelines)
  * [Trigger Severity](#trigger-severity)
  * [Trigger Text](#trigger-text)
* [Timeline Guidelines](#timeline-guidelines)
* [Roadmap](#roadmap)

## Code of Conduct

The code of conduct for cactbot can be found here:
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Issues and Bug Reports

Please file all issues with cactbot on github,
via this url:
<https://github.com/quisquous/cactbot/issues/new/choose>

## Pull Requests

It's vastly preferable to make a lot of small pull requests (that are easy to review)
than very large pull requests (that may conflict or take a while to land).
Each pull request should be small and be self-contained in terms of what it is changing.

If your change is small, just send a pull request and we can have a conversation there.
If your change is big, consider having a conversation before you embark on a lot of work.

If you want to make large mechanical changes to parts of the code,
for example you're irritated at some style usage and want to make everything consistent,
it's especially best to put that in a separate pull request.

Generally, changes will be squashed and rebased together.
If you want your changes to be in separate commits,
then say so explicitly.

### Development Workflow

If you haven't used git before,
it is recommended that you do your work inside of feature branches.
This will let you keep your main branch cleanly tracking the upstream cactbot remote.
All of your local changes (and possibly fixup commits, etc)
can live inside your feature branch,
which you can delete after the feature has landed.

Here's two resources that explain how this "feature branch workflow" can work:

* <https://medium.com/@s.kang919/my-git-feature-branch-workflow-a4b9647ea459>
* <https://gist.github.com/vlandham/3b2b79c40bc7353ae95a>

If you do all of your work on the main branch
and then merge in the upstream cactbot changes,
this will cause pull requests to become harder to read.
git will think there are many different commits to merge in
even though the files on disk are the same.

Additionally, doing work in feature branches
allows you to do two parallel pull requests at the same time,
without entangling them together in the same commits and pull.

#### Commit Validation, Testing, and Linting

Cactbot uses a combination of [husky](https://github.com/typicode/husky)
and [lint-staged](https://github.com/okonet/lint-staged),
along with a suite of linters and tests to ensure code quality.
These validations are done both on a client-side (your computer)
and on the server-side (GitHub).

You will need to [install](README.md#npm-and-webpack) `nodejs` and run `npm install`
in order to install local versions of husky, lint-staged, and eslint.

It is recommended that you also install typescript globally, e.g.

```shell
npm install -g typescript
```

Most commands have npm versions of them, e.g. `npm test` or `npm lint`
You must pass a `--loader` parameter to make these scripts run.

```shell
node --loader=ts-node/esm util/sync_files.ts
```

If the pre-commit validations are causing you significant problems,
feel free to bypass the checks with `--no-verify` flag,
such as `git commit --no-verify`,
and open a pull request even if not everything is passing on your end.
We can try to help with any tests that are failing
and it helps us find any potentially confusing areas in the code.

New contributors are always welcome
and we definitely don't expect anyone to know everything right away.

#### Validating Changes via Webpack

Cactbot uses [Webpack](https://webpack.js.org/) to bundle assets.
Over time, it has become necessary to bundle various things,
such as helper JavaScript files, assets, triggers, and timelines
into the modules themselves
instead of loading files directly off the user's computer.
These assets are bundled by cactbot module (raidboss, oopsyraidsy, etc.)
and can be found within the `dist/` folder
after running either `npm start` or `npm run build`
as `<module>.bundle.js`.

`npm start` will open a local server at <http://localhost:8080>,
allowing you to access cactbot modules at <http://localhost:8080/ui/raidboss/raidboss.html>
(or similar) for the various modules.
The advantage of this approach is that any changes made locally
will immediately update the overlay,
prompting a refresh within the module itself.
This is the recommended approach of validating local code changes.

Alternatively, `npm run build` will locally create a production distribution
of cactbot. This shouldn't be necessary for developing
and will be slower than running `npm start` for validating changes,
but might be useful before checking in code to make sure everything works
as expected if making changes to the [webpack configuration](./webpack.config.cjs)
directly.
Please note that `npm run build` may work currently for testing local changes,
but will break in the future
as development continues away from using local files.
Please consider using `npm start` instead.

#### Validating Changes via Remote URLs

Cactbot has the ability to reference remote GitHub URLs
in place of referencing the HTML file on your computer.
In order to use the main cactbot repository as your cactbot's source URL,
simply enter the cactbot module's full HTML filepath
instead of the HTML file included in the cactbot download.

For example, <https://quisquous.github.io/cactbot/ui/raidboss/raidboss.html>
will use the latest changes for the `raidboss` module pushed to GitHub.

When making changes, it may be helpful to reference your personal fork
via the same methods listed above.
To leverage this free GitHub feature, enable
[GitHub Pages](https://docs.github.com/en/github/working-with-github-pages/about-github-pages#publishing-sources-for-github-pages-sites)
on your personal repository fork,
and configure the source to point to either your `master` or `gh-pages` branch.
From there, any change you'd like to test
can be added to the branch you've selected
and tested in real time by pointing cactbot to use
`<username>.github.io/cactbot/ui/<module>/<module>.html`
as its source.

#### VSCode extension for cactbot

If you are using VSCode, there is an extension [cactbot-highlight](https://marketplace.visualstudio.com/items?itemName=MaikoTan.cactbot-highlight) created by Maiko Tan,
providing timeline highlighting and some useful snippets.

This extension is still in development, if you have any suggestions or bug reports,
feel free to leave an issue/pull request in the repository.

### Code Review Culture

Ideally, all changes should get code review.
Currently, since there's a shortage of people reviewing code.
@quisquous just commits smaller changes directly,
but this is not an ideal situation,
especially since they make a lot of mistakes (sorry).
Please feel free to leave comments about any of these commits
or ask for more things to become pull requests.

Any contributor to cactbot should feel welcome to chime in on any pull request,
if you have ideas about how to make the code better
(even if it's not part of the code you feel like you are an expert in).
Pull requests are a collaborative effort!
There's a lack of good code reviewers at the moment,
so feel encouraged to chip in as you have time and opinions.

The Chromium project has excellent resources on good pull requests and code reviews.
Some of it doesn't apply, but much of the philosophy does.
See these links:

* [Respectful Changes](https://chromium.googlesource.com/chromium/src/+/master/docs/cl_respect.md)
* [Respectful Code Reviews](https://chromium.googlesource.com/chromium/src/+/master/docs/cr_respect.md)

## Coding Style

The ideal end state is that all C#, Python, and Javascript code is linted and autoformatted.
The current state is that Javascript and Python are fairly well linted
(although variable naming conventions are all over the place)
and C# is not very consistent.
Over time, it would be nice to move towards that ideal state.

The primary rule for pull request style is to be consistent with the surrounding code,
*especially* when making unrelated changes.

If you have strong feelings about style and want to add more linting or more rules,
this is highly encouraged but you should likely have a conversation about these rules first.

### Build Problems

cactbot has a number of strict linting rules
in order to make code be consistent and to make code review be an easier process.

Before sending your pull request,
you want to run `npm run test` and `npm run lint` locally to catch any errors.
Running `npm run lintfix` will fix many of them automatically
and will help you not get hassled by the continuous integration travis bot.

When a build fails,
you will get a red ✕ by a commit in your pull request.
It's a little bit confusing to find these errors,
as you have to navigate through several pages to find them.
Click the details link after the
"Test / test (pull_request)"
text to get to the details page.
From there, navigate the left-hand menu to find which specific job failed.
Click on any jobs with an ✕ by them,
and this will open the workflow execution page in the middle of your screen.
This page should show multiple steps with ✓ and ✕ symbols.
If you click the ▶ arrow next to any failed (✕) steps,
it will display the errors within the steps themselves.

If there are errors in the build, such as lint failings,
the complete list of commands being run in CI are found within
[.github/workflows](.github/workflows/README.md)
and can be run locally without needing to commit changes just to test them.
If it is not obvious *which* command is failing,
you can click the workflow in the
[GitHub Actions](https://github.com/quisquous/cactbot/actions)
page and click `Workflow file` to see the exact list of commands being run.
The majority of this file is setting up the workflow runner, and the command
that is failing is most likely going to be found at the bottom,
such as `npm run lint`.

cactbot files should all be in UTF-8.
If you get a BOM error,
this is likely because your editor has saved a file with a different unicode encoding.
For an example of how to remove this, see: <https://notepadunix2dos.info/removebom.html>

## Desired Features

If you are wondering how to contribute to cactbot,
here's a set of features that will almost always be needed:

* fixing bugs
* [issues marked "help wanted"](https://github.com/quisquous/cactbot/issues?utf8=%E2%9C%93&q=label%3A%22help+wanted%22)
* [adding missing timelines](https://github.com/quisquous/cactbot/issues/414)
* missing translations

## Trigger Guidelines

See: [Raidboss Guide](docs/RaidbossGuide.md#trigger-guidelines)

## Timeline Guidelines

See: [Timeline Guide](docs/TimelineGuide.md#cactbot-style-guide)

## Oopsy Guidelines

See: [Oopsy Guide](docs/OopsyraidsyGuide.md#overview)

## Markdown Guidelines

* Improvements and additions to documentation are always welcome.
* Use [semantic line breaks](https://sembr.org/).
* As always, be consistent!
