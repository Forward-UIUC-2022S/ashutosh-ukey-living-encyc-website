"""
Constructs co-occurence graph of keyword w.r.t. sentences.

Runtime log:
    - papers_size: 295306, est time: 39:28 min
"""
from tqdm import tqdm

import json
import pickle
import mysql.connector
from nltk.tokenize import sent_tokenize

from whoosh.index import create_in
from whoosh.fields import Schema, TEXT, STORED


data_root_dir = '../data/'
papers_file = data_root_dir + 'Papers/filtered_arxiv.json'


with open(papers_file, 'r') as f:
    papers = json.load(f)


# Whoosh initialization
schema = Schema(paper_id=STORED(), sentence=TEXT(stored=True))
ix = create_in("arxiv_sentences_ix", schema)

writer = ix.writer()


# Looping through the papers and creating the graph
print("Indexing {} papers".format(len(papers)))
for i in tqdm(range(len(papers))):
    paper = papers[i]
    paper_abstract = paper['abstract']
    paper_sentences = sent_tokenize(paper_abstract)

    for sent in paper_sentences:
        writer.add_document(
            paper_id=paper['id'],
            sentence=sent
        )

writer.commit()



