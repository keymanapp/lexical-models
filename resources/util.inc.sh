#!/usr/bin/env bash

#
# Define terminal colours
#

setup_colors() {
  if [ -z "${OUTPUT_COLOR:-}" ]; then
    OUTPUT_COLOR=auto
  fi

  if [ "$OUTPUT_COLOR" == "auto" ]; then
    # -t 1 tests that the script is running in an interactive terminal as opposed to redirected to file or piped
    if [ -t 1 ]; then
      OUTPUT_COLOR=true
    else
      OUTPUT_COLOR=false
    fi
  fi

  if [ "$OUTPUT_COLOR" == "true" ]; then
    t_red=$'\e[1;31m'
    t_grn=$'\e[1;32m'
    t_yel=$'\e[1;33m'
    t_blu=$'\e[1;34m'
    t_mag=$'\e[1;35m'
    t_cyn=$'\e[1;36m'
    t_end=$'\e[0m'
    NPM_COLOR_FLAG=--color=always
  else
    t_red=
    t_grn=
    t_yel=
    t_blu=
    t_mag=
    t_cyn=
    t_end=
    NPM_COLOR_FLAG=--color=false
  fi
}

#
# We want to avoid globbing * when nothing exists
#

# shopt -s nullglob

#
# Program paths
#

#
# Utility functions
#

pushd () {
    command pushd "$@" > /dev/null
}

popd () {
    command popd "$@" > /dev/null
}

function die {
  local rc=$?
  local msg=$1

  # We are dying, so if previous command didn't actually give
  # an error code, we still want to give an error. We'll give
  # an arbitrary exit code to indicate this
  if [ $rc == 0 ]; then
    rc=999
  fi

  (>&2 echo "${t_red}$msg${t_end}")
  (>&2 echo "${t_red}Aborting with error $rc${t_end}")
  exit $rc
}

function parse_args {
  DO_TEST=true
  DO_BUILD=true
  DO_NPM=true
  WARNINGS_AS_ERRORS=false
  TARGET=()
  PROJECT_TARGET=
  FLAG_SILENT=
  FLAG_DEBUG=
  FLAG_CLEAN=
  START=
  OUTPUT_COLOR=auto

  local key

  # Parse args
  for key in "$@"; do
    case "$key" in
      -validate)
        DO_BUILD=false
        ;;
      -no-npm)
        DO_NPM=false
        ;;
      -s)
        FLAG_SILENT=-s
        ;;
      -d)
        FLAG_DEBUG=-d
        ;;
      -c|-clean)
        FLAG_CLEAN=-c
        ;;
      -w)
        WARNINGS_AS_ERRORS=true
        ;;
      -h|-?)
        display_usage
        ;;
      -no-color)
        OUTPUT_COLOR=false
        ;;
      -color)
        OUTPUT_COLOR=true
        ;;
      *)
        TARGET+=("$key")
    esac
  done
}

#
# Version comparison functions, rely on sort having a -V option
# From: https://stackoverflow.com/a/4024263/1836776
#

function verlte {
  [ "$1" = "`echo -e "$1\n$2" | sort -V | head -n1`" ]
}

function verlt {
  [ "$1" = "$2" ] && return 1 || verlte $1 $2
}

# verlte 2.5.7 2.5.6 && echo "yes" || echo "no" # no
# verlt 2.4.10 2.4.9 && echo "yes" || echo "no" # no
# verlt 2.4.8 2.4.10 && echo "yes" || echo "no" # yes
# verlte 2.5.6 2.5.6 && echo "yes" || echo "no" # yes
# verlt 2.5.6 2.5.6 && echo "yes" || echo "no" # no

# if $(verlte 2.5.7 2.5.6) ; then echo "yes" ; else echo "no" ; fi # no
# if $(verlt 2.4.10 2.4.9) ; then echo "yes" ; else echo "no" ; fi # no
# if $(verlt 2.4.8 2.4.10) ; then echo "yes" ; else echo "no" ; fi # yes
# if $(verlte 2.5.6 2.5.6) ; then echo "yes" ; else echo "no" ; fi # yes
# if $(verlt 2.5.6 2.5.6)  ; then echo "yes" ; else echo "no" ; fi # no
