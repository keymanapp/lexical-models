#!/bin/bash

#----------------------------------------------------------------------------------------
# Build all the models in a given group
#----------------------------------------------------------------------------------------

function build_models {
  # $1 = path to build models
  # for each model, run the default 
  # build based on the folder name and location.
  
  # excluded folders are: shared and template

  local group=$1
  local excluded_folders=" shared template "

  if [ ! -d $MODELROOT/$group ]; then return 0; fi
  
  echo "$ACTION_VERB lexical models for $1"

  local shortname
  for shortname in "$MODELROOT/$group/"*/ ; do
    if [ ! "$(ls -A $shortname)" ]; then
      if [ "$WARNINGS_AS_ERRORS" = true ]; then
        die "$shortname is empty."
      fi  
      echo "$shortname is empty. skipping..."
      continue
    fi

    local base_shortname=$(basename "$shortname")
    if [[ "$base_shortname" == '*' ]]; then
      exit 0
    fi
    
    if [[ "$excluded_folders" == *" $base_shortname "* ]]; then
      echo "- Skipping folder $group/$base_shortname"
    else 
      if [[ "$base_shortname" < "$START" ]]; then
        echo "- Skipping folder $group/$base_shortname, before $START"
      else
        echo "- $ACTION_VERB $group/$base_shortname"
        local model
        for model in "$shortname"*/ ; do
          build_model "$group" "$model"
        done
      fi
    fi
  done
  
  return 0
}

#----------------------------------------------------------------------------------------
# Build a model
#----------------------------------------------------------------------------------------

function build_model {
  local group=$1
  local model=$2
  local shortname=$(basename $(dirname "$model"))
  local base_model=$(basename "$model")
  
  echo "Validating model $model"
    
  pushd "$model"
  
  #
  # Check if .model_info doesn't exist
  #
  model_infoFilename="$shortname.$base_model.model_info"
  if [ ! -f "$model_infoFilename" ]; then
    if [ "$WARNINGS_AS_ERRORS" = true ]; then
      die "$model_infoFilename doesn't exist"
    fi  
    echo "  No $model_infoFilename file. Skipping..."   
    popd
    return 0
  fi
  
  #validate_model_uniqueness "$group" "$model" "$base_model"
  
  if [ "$DO_BUILD" = false ]; then
    popd
    return 0
  fi
  
  build_release_model "$model" || die "Failed to build $group model $base_model"
  
  #
  # Back to root of repo
  #
  
  popd
  return 0
}

#----------------------------------------------------------------------------------------
# Build a model in the release/ or experimental/ folders from full source
#----------------------------------------------------------------------------------------

function build_release_model {
  local model=$1
  local group=$(basename $(dirname $(dirname "$model")))
  local shortname=$(basename $(dirname "$model"))
  local base_model=$(basename "$model")
  echo "$ACTION_VERB model $1"
  
  # local kpj="$base_keyboard.kpj"
  # We don't have a .kpj; we assume presence of .model_info, .kps and model.ts

  # Clean build folder
  
  if [[ -d build ]]; then
    rm -rf build/ || die
  fi
  
  if [[ ! -z "$FLAG_CLEAN" ]]; then
    return 0
  fi
  
  # Recreate build folder
  
  mkdir build || die "Failed to create build folder for $model"
  
  #
  # Check if color is supported
  # -t 2 tests that the script is running in an interactive terminal as opposed to redirected to file or piped
  #
  if [ -t 2 ]; then
    local COLOR_FLAG=--color
  else
    local COLOR_FLAG=
  fi

  pushd build
  mkdir obj
  ../../../../node_modules/.bin/tsc --module commonjs --target es6 --outDir ./obj ../source/model.ts 
  node ./obj/$group/$shortname/$base_model/source/model.js $COLOR_FLAG
  popd

  return 0
}

