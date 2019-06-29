#!/usr/bin/env python3
# -*- coding: UTF-8 -*-

"""
Takes Timothy Montler's original word list and cleans up some punctuation and
other oddities.

Requires Python 3.6!

Maintainer: Eddie Antonio Santos <easantos@ualberta.ca>
"""

import re
import sys
from collections import Counter
from unicodedata import normalize


def nfc(s):
    return normalize('NFC', s)


def uplus(c):
    h = ord(c)
    return f'U+{h:04x}'


SAANICH_ALPHABET = frozenset(nfc(
        'A Á Ⱥ B C Ć Ȼ D E H '
        'I Í J K Ꝁ K̵ ₭ Ḵ Ḱ L Ƚ M '
        'N Ṉ O P Q S Ś s T Ⱦ T̸ Ṯ '
        'Ŧ U W W̱ X X̲ Y Z ¸'
).replace(' ', ''))

FILTER_LIST = frozenset((
        '_ ( ) ˑ ‿ ~ … / ᶿ {} '
        '0 1 2 3 4 5 6 7 8 9 = \u00a0'
        '< > '
).replace(' ', ''))

# I think Americanist transcription snuck in here. Just remove these words.
DENY_LIST = frozenset((
    'Ṭ ʷ ˀ ʔ Ṣ ƛ ŋ č '
).replace(' ', ''))

# These are NOT SENĆOŦEN words!
DENY_WORDS = {
    'LAUGHS',
    'RCMP',
    'GUS'
}

CLEAN_REGEX = re.compile('|'.join(re.escape(c) for c in FILTER_LIST))


# Create the wordlist:
wordlist = Counter()

# Structure of the wordlist provided by Dr. Montler:
#
# A tab-separated values file wherein the first column is the word, and the
# second column is the count.
# **The last line is "### total words." where ### is an non-negative integer**
with open('./saanich.tsv', 'rt', encoding='UTF-8') as saanfile:
    for line in saanfile:
        # Skip the final line (which should contain a total word count).
        if 'total words' in line:
            assert int(line.split()[0]) >= 0
            continue

        word, _, count = line.strip().partition('\t')
        count = int(count)
        word = nfc(word)

        # Remove words with banned characters
        if any(c in DENY_LIST for c in word):
            print(f"ignoring “{word}…”", file=sys.stderr)
            continue

        # Clean the word first
        word = CLEAN_REGEX.sub('', word)

        # Check if it should be denied first.
        if word in DENY_WORDS:
            print(f"ignoring “{word}…”", file=sys.stderr)
            continue

        # Check if it has characters that are outside of the alphabet.
        bad = False
        for c in word:
            if c not in SAANICH_ALPHABET:
                print(f"warning: “{word}” has an invalid character: {uplus(c)} {c}",
                        file=sys.stderr)
                bad = True
        if bad:
            continue

        # Our post-processing could have removed all characters! Skip it!
        if word.strip() == '':
            continue

        wordlist[word] += count

# Print as CRLF TSV:
for word, count in wordlist.most_common():
    print(word, count, sep='\t', end='\r\n')
