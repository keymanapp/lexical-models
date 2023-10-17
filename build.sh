#!/usr/bin/env bash
#
# This script is built with commands available to Git Bash on Windows. (mingw32)

# Prevents 'clear' on exit of mingw64 bash shell
SHLVL=0

## START STANDARD BUILD SCRIPT INCLUDE
# adjust relative paths as necessary
THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
. "${THIS_SCRIPT%/*}/resources/builder.inc.sh"
# END STANDARD BUILD SCRIPT INCLUDE

# script runs from repo root
cd "$THIS_SCRIPT_PATH"

. "./resources/util.inc.sh"
. "./resources/build_targets.inc.sh"
. "./resources/external.inc.sh"

builder_describe \
  "Build Keyman lexical models" \
  clean \
  configure \
  build \
  test \
  "--model,-m=MODEL     Build specific targets only, e.g. release/ or release/nrc/ or release/nrc/nrc.en.mtnt, comma separated"

#?  "--silent,-s          Suppress unnecessary messages"

builder_describe_outputs \
  configure   /node_modules

builder_parse "$@"

#------------------------------------------------------------
# Definitions
#------------------------------------------------------------

if [[ -z ${KMC+x} ]]; then
  export KMC="${REPO_ROOT}/node_modules/.bin/kmc"
  readonly KMC
fi

# TODO: remove -W
export KMC_BUILD_PARAMS="build $builder_debug --for-publishing"
readonly KMC_BUILD_PARAMS
# readonly KMC_CLEAN_PARAMS="clean"
# readonly KMC_TEST_PARAMS="test"

#------------------------------------------------------------
# Commands
#------------------------------------------------------------

function do_clean() {
  do_clean_externals
  do_clean_targets
}

function do_clean_externals() {
  test -f build_external_targets.txt || return 0
  local model=
  for model in $(cat build_external_targets.txt); do
    pushd "$model"
    clean_external_target_folder
    popd
  done
}

function do_clean_targets() {
  test -f build_targets.txt || return 0
  local model=
  for model in $(cat build_targets.txt); do
    rm -rf "$model/build/"
    rm -f "$model/*.kpj.user"
  done
}

#------------------------------------------------------------

function do_configure() {
  npm install --no-optional
  builder_echo "kmc version: $($KMC --version)"
}

#------------------------------------------------------------

function do_build() {
  do_build_externals
  do_build_targets
}

function do_build_externals() {
  test -f build_external_targets.txt || return 0
  local model=
  for model in $(cat build_external_targets.txt); do
    local model_basename=$(basename $model)
    builder_echo "Downloading external model $model"
    pushd "$model"
    retrieve_external_model

    if [ -f .source_is_binary ]; then
      # All these files must exist, so we'll fail if they are not present
      mkdir -p build/
      cp $model_basename.model_info build/
      cp source/$model_basename.model.js build/
      cp source/$model_basename.model.kmp build/
      # TODO: consider verifying the .model_info
    else
      # add it to list of build targets
      echo "$model" >> "$THIS_SCRIPT_PATH/build_targets.txt"
    fi

    popd
  done
}

function do_build_targets() {
  test -f build_targets.txt || return 0
  $KMC $KMC_BUILD_PARAMS @build_targets.txt
}

#------------------------------------------------------------

function do_test() {
  echo "TODO: support test"
  # "$KMC" $KMC_TEST_PARAMS @build_targets.txt
  # No tests available for external targets
}

#------------------------------------------------------------
# Main
#------------------------------------------------------------

if builder_has_option --model; then
  # Split $MODEL into an array, split with comma
  IFS=',' read -ra TARGETS <<< "$MODEL"
else
  TARGETS=(release experimental)
fi

collect_build_targets

builder_run_action clean      do_clean
builder_run_action configure  do_configure
builder_run_action build      do_build
builder_run_action test       do_test
