#!/usr/bin/env bash

tputcolors=$(tput colors)

echo "Testing colours"
echo "TERM: $TERM"
echo "tput colors: $tputcolors"

t_red=$'\e[1;31m'
t_end=$'\e[0m'

if [[ -t 1 ]]; then
  echo "${t_red}-t 1 == true${t_end}"
  DO_COLOR=true
else
  echo "-t 1 == false"
  DO_COLOR=false
fi

if [[ -n "$TERM" ]] && [[ "$TERM" != "dumb" ]] && [[ "$TERM" != "unknown" ]]; then
  echo "${t_red}TERM -- assuming colours available${t_end}"
else
  echo "TERM -- assuming no colors"
fi

if [ -n "$tputcolors" ] && [ $tputcolors -ge 8 ]; then
  echo "${t_red}tputcolors true${t_end}"
else
  echo "tputcolors false"
fi