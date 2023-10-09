#
# Build a list of all targets that we will be building, in a specific order:
# * release
# * experimental
#
# Expects global $TARGETS array; does not take this as a parameter due to spaces
# in paths which are tedious to avoid
#
# Note: this is similar to build_targets.inc.sh in keyboards repo, but simpler
# because there are no special cases
#
function collect_build_targets() {
  rm -f build_targets.txt build_targets_temp.txt build_external_targets.txt

  local target

  for target in "${TARGETS[@]}"; do
    # strip trailing delimiter if present
    target="${target%%/}"

    # it's easiest to treat each level of possible target separately
    if [[ "$target" == */*/* ]]; then
      find "$target" -maxdepth 1 -type d -wholename "$target" >> build_targets_temp.txt
    elif [[ "$target" == */* ]]; then
      find "$target" -maxdepth 1 -type d -wholename "$target"'/*' >> build_targets_temp.txt
    else
      find "$target" -maxdepth 2 -type d -wholename "$target"'/*/*' >> build_targets_temp.txt
    fi
  done

  # filter build_targets.txt to exclude externally built here
  local target
  for target in $(cat build_targets_temp.txt); do
    local model_name=$(basename $target)
    if [[ -f "$target/external_source" ]]; then
      echo "$target" >> build_external_targets.txt
    elif [[ -f "$target/source/$model_name.model.ts" ]]; then
      # only include targets with a source .model.ts
      echo "$target" >> build_targets.txt
    fi
  done

  rm -f build_targets_temp.txt
}