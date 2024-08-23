#
# Build a list of all targets that we will be building, in a specific order:
# * release
# * experimental
#
# Expects global $TARGETS array; does not take this as a parameter due to
# spaces in paths which are tedious to avoid
#
function collect_build_targets() {
  rm -f build_targets.txt build_targets_temp.txt build_external_targets.txt

  local target=

  for target in "${TARGETS[@]}"; do
    # strip trailing delimiter if present
    target="${target%%/}"

    # because of special cases, it's easiest to treat each level of possible target separately

    if [[ "$target" == */*/* ]]; then
      # echo "$target" >> build_targets.txt
      (find "$target" -maxdepth 1 -type d -wholename "$target" || true) >> build_targets_temp.txt
    elif [[ "$target" == */* ]]; then
      (find "$target" -maxdepth 1 -type d -wholename "$target"'/*' || true) >> build_targets_temp.txt
    else
      (find "$target" -maxdepth 2 -type d -wholename "$target"'/*/*' || true) >> build_targets_temp.txt
    fi
  done

  if [[ -f build_targets_temp.txt ]]; then
    # filter build_targets.txt to exclude externally built here
    while IFS= read -r target; do
      local model_name="${target##*/}"
      if [[ -f "$target/external_source" ]]; then
        echo "$target" >> build_external_targets.txt
      elif [[ -f "$target/source/$model_name.model.kps" ]]; then
        # only include targets with a source .kps
        echo "$target" >> build_targets.txt
      fi
    done < build_targets_temp.txt
  fi

  rm -f build_targets_temp.txt
}