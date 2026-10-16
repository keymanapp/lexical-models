# Lemko lexical model

Version 0.3.0 — initial submission.

Predictive-text model for Lemko using 219,273 distinct Cyrillic forms. The language tag `rue` denotes Rusyn broadly; the model's vocabulary and visible labels specifically target Lemko. Companion keyboard submission: https://github.com/keymanapp/keyboards/pull/4191.

## Sources and processing

The source list combines the lemko.tools dictionary's non-deleted, redacted entries and inflections with original Bukvaky spreadsheet forms before game normalization. The inputs contained 34,625 headwords, 1,799,549 inflection records (including many empty fields), and 797 spreadsheet records. Homonym labels are removed from headwords; valid components of phrases and explicitly separated alternatives are extracted. NFC normalization preserves casing, accents and distinctions between і/ї, и/й and г/ґ. Mixed Latin/Cyrillic forms are excluded rather than silently corrected.

Positive counts for 69,465 forms come from 1,766 exactly deduplicated texts reconstructed from a subset of the existing Qdrant corpus index. This sample contains 2,340,982 Cyrillic token occurrences. Reconstruction used file names and contiguous chunk indices, excluding unmatched sources and documents with possible overlapping chunks. Exact document duplicates were removed after NFC and whitespace normalization; near-duplicates and shared quotations were not detected. Counts remain case-sensitive. These are measurements of this indexed subset, not of all original corpus files. Forms not observed in the subset have no count column and receive Keyman's default weight of 1; this default is not a measured occurrence. Corpus-only forms are not automatically admitted.

No original corpus texts, database credentials, or personal records are included. The contributor has confirmed the right to publish the dictionary forms, spreadsheet forms and derived frequency data under MIT. See LICENSE.md.

## Build and validation

`kmc build lemkotools.rue.lemko.kpj`

Compilation with kmc 18.0.253 passes. The compiled trie was checked for an exact match of every form, search key and weight. Data tests cover Unicode distinctions, provenance, unknown counts, mixed-script rejection and corpus deduplication. The custom normalizer lowercases and normalizes to NFC without removing diacritics.

Native Android/iOS prediction quality, correction ranking, automatic replacement/undo and offline-restart acceptance remain untested. Only 200 prototype forms have explicit individual linguistic approval; remaining forms retain source-level provenance and await full linguistic review. No desktop system-wide autocorrection is supplied by this model. This draft is not a claim that release-quality acceptance is complete.
