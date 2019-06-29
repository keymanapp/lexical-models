# How to build the wordlist!
#
# Sources:
#  - SaanichWordFreq.txt: Provided by Dr. Timothy Montler. NOT included in
#    this repository!
SOURCES = SaanichWordFreq.txt

saanich.tsv: fix-wordlist.py $(SOURCES)
	python3 fix-wordlist.py $(SOURCES)
