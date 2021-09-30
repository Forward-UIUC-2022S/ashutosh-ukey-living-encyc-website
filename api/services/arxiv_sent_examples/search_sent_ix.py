import sys
import json

from whoosh.index import open_dir
from whoosh.qparser import QueryParser
from whoosh import highlight

paper_url_template = "https://arxiv.org/abs/{paper_id}"
res_file = "sentences.json"

class MarkFormatter(highlight.Formatter):
    """Encloses matched terms in <mark> HTML tag."""

    def format_token(self, text, token, replace=False):
        # Use the get_text function to get the text corresponding to the
        # token
        tokentext = highlight.get_text(text, token, replace)

        # Return the text as you want it to appear in the highlighted
        # string
        return "<mark>%s</mark>" % tokentext


def get_sentences(cmd_lin_inp):
    inps = cmd_lin_inp.split()
    
    keyword = inps[0].replace('+', ' ')
    num_requested = int(inps[1])

    with ix.searcher() as searcher:
        query = QueryParser("sentence", ix.schema).parse(keyword)
        results = searcher.search(query)

        # Configuration for whoosh highlighting
        results.formatter = MarkFormatter()
        results.fragmenter.surround = 500
        
        num_results = min(num_requested, len(results))
        res_json = []

        for i in range(num_results):
            paper_url = paper_url_template.format(paper_id=results[i]['paper_id'])
            formatted_sentence = results[i].highlights("sentence")

            kw_dict = {
                'sentence': formatted_sentence,
                'paper_url': paper_url
            }
            res_json.append(kw_dict)

    print(json.dumps(res_json))

    # print("Done generating data")

if __name__ == '__main__':

    # Load whoosh text index
    ix = open_dir("arxiv_sentences_ix")

    # https://stackoverflow.com/questions/7091413/how-do-you-read-from-stdin-in-python-from-a-pipe-which-has-no-ending
    try:
        buff = ''
        while True:
            buff += sys.stdin.read(1)
            if buff.endswith('\n'):
                get_sentences(buff[:-1])
                sys.stdout.flush()
                buff = ''

    except KeyboardInterrupt:
        sys.stdout.flush()
        pass