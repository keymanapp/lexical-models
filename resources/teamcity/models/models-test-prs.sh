#!/usr/bin/env bash
# Keyman is copyright (C) SIL Global. MIT License.

# shellcheck disable=SC2164
# shellcheck disable=SC1091

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/../../../resources/builder.inc.sh"
## END STANDARD BUILD SCRIPT INCLUDE

################################ Main script ################################

builder_describe \
  "Test build of pull request" \
  "all            run all actions"

builder_parse "$@"

function do_build() {
  builder_echo "Building all models"
  "${REPO_ROOT}/build.sh" configure build test
  builder_echo "Finished building all models"
}

cd "${REPO_ROOT}"

builder_run_action  all    do_build
