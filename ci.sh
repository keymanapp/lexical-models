#!/bin/bash

function display_usage {
  echo "Usage: ci.sh [release|experimental[/m/model]]"
  exit 1
}

#
# Prevents 'clear' on exit of mingw64 bash shell
#
SHLVL=0

#
# Define paths; note Windows hosted bash assumptions for now
#
MODELROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JQ="$MODELROOT/tools/jq-win64.exe"
RSYNC="$MODELROOT/tools/rsync.exe"
CI_CACHE="$MODELROOT/.cache"

if [ ! -z "$SEVENZ_HOME" ]; then
  APP7Z="$SEVENZ_HOME/7z"
else
  APP7Z="/c/Program Files/7-Zip/7z.exe"
fi

. "$MODELROOT/servervars.sh"
. "$MODELROOT/resources/util.sh"
. "$MODELROOT/resources/rsync-tools.sh"

parse_args "$@"
setup_colors

function run {

  if [ ! -d "$CI_CACHE" ]; then
    mkdir "$CI_CACHE"
  fi

  if [[ $DO_UPLOAD_ONLY == true ]]; then
    if [ ! -d "$CI_CACHE/upload" ]; then
      mkdir "$CI_CACHE/upload"
    fi
    rsync_to_downloads_keyman_com "$CI_CACHE/upload/" models/ true
    exit 0
  fi

  if [[ $DO_ZIP_ONLY == true ]]; then
    if [ ! -d "$CI_CACHE/data" ]; then
      mkdir "$CI_CACHE/data"
    fi
    if [ ! -d "$CI_CACHE/upload" ]; then
      mkdir "$CI_CACHE/upload"
    fi
    zip_model_info
    rsync_to_downloads_keyman_com "$CI_CACHE/data/" data/
    exit 0
  fi

  if [ -d "$CI_CACHE/upload" ]; then
    rm -rf "$CI_CACHE/upload"
  fi
  mkdir "$CI_CACHE/upload"

  if [ -d "$CI_CACHE/data" ]; then
    rm -rf "$CI_CACHE/data"
  fi
  mkdir "$CI_CACHE/data"

  upload_models_by_target

  zip_model_info
  rsync_to_downloads_keyman_com "$CI_CACHE/data/" data/
}

##
## Main function
##
function upload_models_by_target {
  if [[ "$TARGET" ]]; then
    if [[ "$TARGET" == */* ]] && [[ (-d "$TARGET") ]]; then
      group=$(cut -d / -f 1 <<< "$TARGET")
      author=$(cut -d / -f 2 <<< "$TARGET")
      echo "${t_grn}--- Only uploading $group $TARGET ---${t_end}"
      upload_model $group "$TARGET"
    elif [[ "$TARGET" == "release" ]] || [[ "$TARGET" == "experimental" ]]; then
      # Assuming release|experimental
      echo "${t_grn}--- Only uploading $TARGET ---${t_end}"
      upload_models "$TARGET"
    else
      echo "Invalid $TARGET"
      display_usage
    fi
  else
    upload_models release
    upload_models experimental
  fi

  rsync_to_downloads_keyman_com "$CI_CACHE/upload/" models/ true
}

##
## Prepare for upload puts a file into the upload cache
## in preparation for it being rsync'd to the server
##
function prepare_for_upload {
  local source_filename=$1
  local upload_filename=$2
  local upload_path=`dirname "$upload_filename"`

  mkdir -p "$CI_CACHE/upload/$upload_path"
  cp "$source_filename" "$CI_CACHE/upload/$upload_filename"
}

##
## Prepares a single model for upload
##
function upload_model {
  local group=$1
  local model=$2
  local base_model=$(basename "$model")
  local shortname=$(basename $(dirname "$model"))
  local buildpath=$MODELROOT/$group/$shortname/$base_model/build
  local model_info=$buildpath/$base_model.model_info

  echo "${t_grn}Uploading $model${t_end}"

  [ -f "$model_info" ] || die "Failed to locate $model_info"

  local package_filename=`cat "$model_info" | $JQ -r '.packageFilename'`
  local js_filename=`cat "$model_info" | $JQ -r '.jsFilename'`

  # jq returns 'null' if the entry is missing, instead of ''
  if [[ $package_filename == "null" ]]; then
    die "Missing package filename for $model in .model_info"
  else
    [ -f "$buildpath/$package_filename" ] || die "Failed to locate $buildpath/$package_filename"
  fi

  if [[ $js_filename == "null" ]]; then
    die "Missing javascript filename for $model in .model_info"
  else
    [ -f "$buildpath/$js_filename" ] || die "Failed to locate $buildpath/$js_filename"
  fi

  local package_version=`cat "$model_info" | $JQ -r '.version'`
  local package_name=`cat "$model_info" | $JQ -r '.name'`
  local package_upload_path=$base_model/$package_version/$package_filename
  local model_info_upload_path=$base_model/$package_version/$base_model.model_info
  local js_upload_path=$base_model/$package_version/$js_filename

  local package_url=$DOWNLOADS_KEYMAN_COM_URL/models/$package_upload_path
  local model_info_url=$DOWNLOADS_KEYMAN_COM_URL/models/$model_info_upload_path
  local installer_url=$DOWNLOADS_KEYMAN_COM_URL/models/$installer_upload_path
  local js_url=$DOWNLOADS_KEYMAN_COM_URL/models/$js_upload_path

  echo "${t_grn}Package name: $package_name, version: $package_version${t_end}"

  prepare_for_upload "$model_info" "$model_info_upload_path"
  prepare_for_upload "$buildpath/$js_filename" "$js_upload_path"
  prepare_for_upload "$buildpath/$package_filename" "$package_upload_path"
}

##
## (Tweaked clone of build_models in compile.sh)
##
function upload_models {
  # $1 = path to build models
  # for each model, if a build.sh file exists, call it, otherwise, run the default
  # build based on the folder name and location.

  # excluded folders are: shared and template

  local group=$1
  local excluded_folders=" shared template "

  echo "Uploading models for $1"
  local shortname
  for shortname in "$MODELROOT/$group/"*/ ; do
    local base_shortname=$(basename "$shortname")
    if [[ "$base_shortname" == '*' ]]; then
      return 0
    fi

    if [[ "$excluded_folders" == *" $base_shortname "* ]]; then
      echo "- Skipping folder $group/$base_shortname"
    else
      if [[ "$base_shortname" < "$START" ]]; then
        echo "- Skipping folder $group/$base_shortname, before $START"
      else
        echo "- Uploading $group/$base_shortname"
        local model
        for model in "$shortname"*/ ; do
          upload_model "$group" "$model"
        done
      fi
    fi
  done

  return 0
}

##
## zips all .model_info files from .cache/upload/ into .cache/data/model_info.zip
##

function zip_model_info {
  # We use an @list file to give a specific list of files to
  # 7z so that it does not include pathnames in the archive
  # The "./" on the front of the search is also needed to force 7Z to not
  # include pathnames in the archive
  local files=(./.cache/upload/*/*/*.model_info)
  printf "%s\n" "${files[@]}" > .cache/model_info.list
  "$APP7Z" a ".cache/data/model_info.zip" @.cache/model_info.list
  rm .cache/model_info.list
}

############################################################################################

run

############################################################################################
# EOF
############################################################################################