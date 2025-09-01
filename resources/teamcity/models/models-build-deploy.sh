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
  "Build and deploy models" \
  "all            run all actions" \
  "build          build models" \
  "publish        deploy models" \
  "--downloads-keyman-com=DOWNLOADS_KEYMAN_COM_URL  URL of downloads server" \
  "--rsync-path=REMOTE_RSYNC_PATH                   Path to rsync on remote server" \
  "--rsync-dest=RSYNC_DEST                          Destination for rsync"

builder_parse "$@"

export DOWNLOADS_KEYMAN_COM_URL
export REMOTE_RSYNC_PATH
export RSYNC_DEST

function do_build() {
  builder_echo "Building all models"
  "${REPO_ROOT}/build.sh" configure build test
  builder_echo "Finished building all models"
}

function do_publish() {
  if [[ -z "${DOWNLOADS_KEYMAN_COM_URL+x}" ]]; then
    builder_die "Option --downloads-keyman-com must be specified for publish action"
  fi
  if [[ -z "${REMOTE_RSYNC_PATH+x}" ]]; then
    builder_die "Option --rsync-path must be specified for publish action"
  fi
  if [[ -z "${RSYNC_DEST+x}" ]]; then
    builder_die "Option --rsync-dest must be specified for publish action"
  fi
  builder_echo "Uploading models to downloads.keyman.com"
  "${REPO_ROOT}/ci.sh"
  builder_echo "Finished uploading models to downloads.keyman.com"
}

cd "${REPO_ROOT}"

if builder_has_action all; then
  do_build
  do_publish
else
  builder_run_action  build    do_build
  builder_run_action  publish  do_publish
fi
