# Lemko lexical model

Version 0.3.0.

Predictive-text model for Lemko containing 219,273 distinct forms, associated with language `rue`. Companion keyboard: https://github.com/keymanapp/keyboards/pull/4191.

## Sources and processing

The data comes from edited entries in the lemko.tools dictionary. The inputs contained 34,625 headwords and 1,799,549 inflection records.

NFC normalization preserves casing, accents and distinctions between Cyrillic letters.

## Build and validation

Tests cover compiled dictionary consistency, Unicode, provenance, missing frequencies, mixed scripts and deduplication.

`kmc build lemkotools.rue.lemko.kpj`
