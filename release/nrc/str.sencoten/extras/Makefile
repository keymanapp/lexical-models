# How to build the wordlist!
#
# Sources:
#  - SaanichWordFreq.txt: Provided by Dr. Timothy Montler.
#    NOT included in this repository!
#    SHA384 sum: 5e31a32eaab3aa23e029f72fb3097f9fb97982fe9c927dd99093d3f1071c1b81d43926e4c9abc79a1afe75c63cfb599c
SOURCES = SaanichWordFreq.txt
DEST = ../../../release/nrc/str.sencoten/source/saanich.tsv

$(DEST): fix-wordlist.py $(SOURCES)
	python3 fix-wordlist.py $(SOURCES) $@
