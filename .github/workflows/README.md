# Workflows

Replacing [Travis CI](https://travis-ci.org/) as this project's primary CI/CD tool,
[GitHub Actions](https://help.github.com/en/actions) uses workflows to perform operations
when specific events within the repository occur.
Workflows are specified in YAML and can utilize shared components
from other GitHub Actions to form expansive pipelines.

These workflows should appear within pull requests as status indicators
that denote "pending”, “success”, “failure”, or “error",
and should contain detail links to view the workflows and their individual steps therein.
Additionally, these workflow runs should be visible by clicking
the [Actions](https://github.com/OverlayPlugin/cactbot/actions) tab
in the repository's menu at the top of the repository's main page.
