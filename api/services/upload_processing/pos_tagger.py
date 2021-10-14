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


def tag_pos(text):
    pos_tags = [tok.pos_ for tok in nlp(text)]

    res_str = "><".join(pos_tags)
    res_str = "<" + res_str + ">"

    return res_str


if __name__ == '__main__':
    get_keywords_sql = """
        SELECT id, name 
        
        FROM keyword 
    """
    cur.execute(get_keywords_sql)
    keyword_ts = cur.fetchall()

    insert_args = []

    for i in tqdm(range(len(keyword_ts))):
        kw_t = keyword_ts[i]
        kw_pos = tag_pos(kw_t[1])
        cur_insert_args = (kw_pos, kw_t[0])

        insert_args.append(cur_insert_args)
        # print(f"{kw_t[1]} :: {kw_pos}")

    insert_sql = """
        UPDATE keyword 

        SET pos=%s
        WHERE id=%s
    """
    cur.executemany(insert_sql, insert_args)
    db.commit()
