#!/bin/bash

set -e

#
# This script is built with commands available to Git Bash on Windows. (mingw32)
#

function display_usage {
  echo "Usage: $0 [-t(est)|-b(uild)|-c(lean)] [-s] [target]"
  echo "  -t || -test   Runs tests on models"
  echo "  -b || -build  Creates compiled models"
  echo "  -c || -clean  Cleans intermediate and output files"
  echo "  -s            Quiet build"
  echo "  target        The specific model(s) to build, e.g. release or release/example/en.template"
  echo "                If omitted, builds all models"
  exit 1
}

#
# Define paths
#
MODELROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Master json schema is from https://api.keyman.com/schemas/model_info.json

MODELINFO_SCHEMA_JSON="$MODELROOT/tools/model_info.source.json"
MODELINFO_SCHEMA_DIST_JSON="$MODELROOT/tools/model_info.distribution.json"

. "$MODELROOT/resources/util.sh"
. "$MODELROOT/resources/compile.sh"
#. "$MODELROOT/resources/validate.sh"
#. "$MODELROOT/resources/merge.sh"

#
# Build parameters
#
# Default is validate model_info, build models
#

parse_args "$@"

#
# Pull dependencies (TODO: once this stabilises, we will use npm published packages).
# This assumes you've already run `npm link .` in the $KEYMAN
#

if [[ ! -z "$KEYMAN_ROOT" ]]; then
  echo "Building lexical model compiler from Keyman repo and publishing via npm link"
  pushd "$KEYMAN_ROOT"/developer/js
  npm install
  npm run build
  pwd
  npm link .
  popd
fi

npm link @keymanapp/developer-lexical-model-compiler

#
# Select action
#

if [ "$DO_BUILD" = false ]; then
  ACTION_VERB=Testing
elif [[ ! -z "$FLAG_CLEAN" ]]; then
  ACTION_VERB=Cleaning
else
  ACTION_VERB=Building
fi

#
# Collect filenames
#

MODEL_INFO_PATHS="$MODELROOT"/*/*/*/*.model_info
MODEL_INFOS=($MODEL_INFO_PATHS)
MODEL_INFOS=`printf -- '%s\n' "${MODEL_INFOS[@]}"`

#
# Run build
#

if [[ "$TARGET" ]]; then
  if [[ "$TARGET" == */* ]] && [[ (-d "$TARGET") ]]; then
    group=$(cut -d / -f 1 <<< "$TARGET")
    echo "--- Only building $group $TARGET ---"
    build_model $group "$TARGET"
  elif [[ "$TARGET" == "release" ]] || [[ "$TARGET" == "experimental" ]]; then
    # Assuming release|experimental
    echo "--- Only building $TARGET ---"
    build_models "$TARGET"
  else
    display_usage
  fi
else
  build_models release
  build_models experimental
fi


# todo copy multi-folder approach from keyboards repo

