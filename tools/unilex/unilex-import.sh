#!/bin/bash
#
# This scripts builds the lexical models found at
# ../../unilex. You can specify an alternate path
# as the only parameter
#

set -u
set -e

unilex=../../../unilex
root=../../release/unilex
template=unilex.aaa.unilex
filename=
next=

# Parse args
for key in "$@"; do
  if [ ! -z "$next" ]; then
    # We know that -u specifies the source path for unilex
    next=
    unilex="$key"
  else
    case "$key" in
      -u)
        next="$key"
        ;;
      *)
        filename="$key"
    esac
  fi
done

unilex="$unilex/data/frequency"

function createTargetFile() {
  local target="$1"
  local template="$2"
  local tag="$3"

  if [ ! -f "$target" ]; then
    sed -e "s/aaa/$tag/g" < "template/$template" > "$target"
  fi
}

function createModel() {
  local filename="$1"
  # strip _ prefix, e.g. for _con.txt
  tag=${filename#_}
  tag=${tag%.txt}

  # strip file extension
  target=unilex.$tag.unilex

  echo "  Preparing model $target for BCP 47 code $tag..."

  # Create folders

  if [ ! -d $root/$target ]; then
    mkdir -p $root/$target
  fi

  if [ ! -d $root/$target/source ]; then
    mkdir -p $root/$target/source
  fi

  # Create or update metadata files

  createTargetFile $root/$target/$target.model_info $template.model_info $tag
  createTargetFile $root/$target/$target.kpj $template.kpj $tag
  createTargetFile $root/$target/README.md README.md $tag
  createTargetFile $root/$target/HISTORY.md HISTORY.md $tag
  createTargetFile $root/$target/source/$target.model.kps source/$template.model.kps $tag
  createTargetFile $root/$target/source/$target.model.ts source/$template.model.ts $tag

  # Copy the wordlist (rely on git for diffs for now)
  # TODO: diff and then refresh versions in metadata

  sed 1d < "$unilex/$filename" > $root/$target/source/wordlist.tsv
}


if [ ! -z "$filename" ]; then
  createModel "$filename"
  exit 0
fi

for filename in "$unilex"/* ; do
  echo "$filename"
  if [[ $filename =~ - ]]; then
    echo Skipping for now as not a plain bcp 47 code
    continue
  fi

  target=`basename "$filename"`
  createModel "$target"
done
