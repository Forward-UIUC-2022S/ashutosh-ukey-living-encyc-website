import os
from tqdm import tqdm
from dotenv import load_dotenv
import mysql.connector

import spacy

# Read environment variables
env_file = "../../.env"
load_dotenv(env_file)

# Load models
db = mysql.connector.connect(
  host="localhost",
  user=os.getenv('MYSQL_USER'),
  password=os.getenv('MYSQL_PASS'),
  database=os.getenv('MYSQL_DB')
)
cur = db.cursor()

nlp = spacy.load("en_core_web_sm")


def get_lemma(text):
    pos_tags = [tok.lemma_ for tok in nlp(text)]

    res_str = " ".join(pos_tags)
    return res_str


if __name__ == '__main__':
    get_keywords_sql = """
        SELECT id, name 
        
        FROM keyword 
    """
    cur.execute(get_keywords_sql)
    keyword_ts = cur.fetchall()

    lemma_to_kw_ids = {}

    for i in tqdm(range(len(keyword_ts))):
        kw_t = keyword_ts[i]
        kw_lemma = get_lemma(kw_t[1])

        if kw_lemma not in lemma_to_kw_ids:
            lemma_to_kw_ids[kw_lemma] = []

        lemma_to_kw_ids[kw_lemma].append(kw_t[0])

    lemmas = list(lemma_to_kw_ids.keys())
    for i in tqdm(range(len(lemmas))):
        lemma = lemmas[i]

        insert_root_sql = """
            INSERT INTO root 

            (lemma) VALUES (%s)
        """
        cur.execute(insert_root_sql, [lemma])
        cur_lemma_id = cur.lastrowid

        update_root_sql = """
            UPDATE keyword 

            SET root_id=%s
            WHERE id=%s
        """

        update_roots_args = []
        for kw_id in lemma_to_kw_ids[lemma]:
            cur_update_arg = (cur_lemma_id, kw_id)
            update_roots_args.append(cur_update_arg)

        cur.executemany(update_root_sql, update_roots_args)

    db.commit()
