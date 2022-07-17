import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


db = mysql.connector.connect(
  host=os.getenv('MYSQL_HOST'),
  user=os.getenv('MYSQL_USER'),
  password=os.getenv('MYSQL_PASS'),
  database=os.getenv('MYSQL_DB')
)