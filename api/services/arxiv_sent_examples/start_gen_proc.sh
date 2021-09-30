#!/bin/bash
WD=$1

cd $WD/services/arxiv_sent_examples

source env/bin/activate

python3 search_sent_ix.py