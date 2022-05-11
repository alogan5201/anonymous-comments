from __future__ import print_function, unicode_literals
import nltk
import re 
import pandas as pd
nltk.download('punkt')
from nltk.tokenize import TweetTokenizer, sent_tokenize


import nltk.data
from wikidata.client import Client
from icecream import ic

   
list1 = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh']
list2= ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh']
list3 = ['first', 'second', 'third', 'fourth']
list4 =  ['Two',
                   'imprisoned',
                   'men',
                   'bond',
                   'over',
                   'a',
                   'number',
                   'of',
                   'years,',
                   'finding',
                   'solace',
                   'and',
                   'eventual',
                   'redemption',
                   'through',
                   'acts',
                   'of',
                   'common',
                   'decency.',
                   'Chronicles',
                   'the',
                   'experiences',
                   'of',
                   'a',
                   'formerly',
                   'successful',
                   'banker',
                   'as',
                   'a',
                   'prisoner',
                   'in',
                   'the',
                   'gloomy',
                   'jailhouse',
                   'of',
                   'Shawshank',
                   'after',
                   'being',
                   'found',
                   'guilty',
                   'of',
                   'a',
                   'crime',
                   'he',
                   'did',
                   'not',
                   'commit.',
                   'The',
                   'film',
                   'portrays',
                   'the',
                   "man's",
                   'unique',
                   'way',
                   'of',
                   'dealing',
                   'with',
                   'his',
                   'new,',
                   'torturous',
                   'life;',
                   'along',
                   'the',
                   'way',
                   'he',
                   'befriends',
                   'a',
                   'number',
                   'of',
                   'fellow',
                   'prisoners,',
                   'most',
                   'notably',
                   'a',
                   'wise',
                   'long-term',
                   'inmate',
                   'named',
                   'Red.',
                   'J-S-Golden',
                   'After',
                   'the',
                   'murder',
                   'of',
                   'his',
                   'wife,',
                   'hotshot',
                   'banker',
                   'Andrew',
                   'Dufresne',
                   'is',
                   'sent',
                   'to',
                   'Shawshank',
                   'Prison,',
                   'where',
                   'the',
                   'usual',
                   'unpleasantness',
                   'occurs.',
                   'Over',
                   'the',
                   'years,',
                   'he',
                   'retains',
                   'hope',
                   'and',
                   'eventually',
                   'gains',
                   'the',
                   'respect',
                   'of',
                   'his',
                   'fellow',
                   'inmates,',
                   'especially',
                   'longtime',
                   'convict',
                   'Red',
                   'Redding,',
                   'a',
                   'black',
                   'marketeer,',
                   'and',
                   'becomes',
                   'influential',
                   'within',
                   'the',
                   'prison.',
                   'Eventually,',
                   'Andrew',
                   'achieves',
                   'his',
                   'ends',
                   'on',
                   'his',
                   'own',
                   'terms.',
                   'Reid',
                   'Gagle',
                   'Andy',
                   'Dufresne',
                   'is',
                   'sent',
                   'to',
                   'Shawshank',
                   'Prison',
                   'for',
                   'the',
                   'murder',
                   'of',
                   'his',
                   'wife',
                   'and',
                   'her',
                   'secret',
                   'lover.',
                   'He',
                   'is',
                   'very',
                   'isolated',
                   'and',
                   'lonely',
                   'at',
                   'first,',
                   'but',
                   'realizes',
                   'there',
                   'is',
                   'something',
                   'deep',
                   'inside',
                   'your',
                   'body',
                   'that',
                   'people',
                   "can't",
                   'touch',
                   'or',
                   'get',
                   "to....'HOPE'.",
                   'Andy',
                   'becomes',
                   'friends',
                   'with',
                   'prison',
                   "'fixer'",
                   'Red,',
                   'and',
                   'Andy',
                   'epitomizes',
                   'why',
                   'it',
                   'is',
                   'crucial',
                   'to',
                   'have',
                   'dreams.',
                   'His',
                   'spirit',
                   'and',
                   'determination',
                   'lead',
                   'us',
                   'into',
                   'a',
                   'world',
                   'full',
                   'of',
                   'imagination,',
                   'one',
                   'filled',
                   'with',
                   'courage',
                   'and',
                   'desire.',
                   'Will',
                   'Andy',
                   'ever',
                   'realize',
                   'his',
                   'dreams?',
                   'Andy',
                   'Haque',
                   'Bank',
                   'Merchant',
                   'Andy',
                   'Dufresne',
                   'is',
                   'convicted',
                   'of',
                   'the',
                   'murder',
                   'of',
                   'his',
                   'wife',
                   'and',
                   'her',
                   'lover,',
                   'and',
                   'sentenced',
                   'to',
                   'life',
                   'imprisonment',
                   'at',
                   'Shawshank',
                   'prison.',
                   'Life',
                   'seems',
                   'to',
                   'have',
                   'taken',
                   'a',
                   'turn',
                   'for',
                   'the',
                   'worse,',
                   'but',
                   'fortunately',
                   'Andy',
                   'befriends',
                   'some',
                   'of',
                   'the',
                   'other',
                   'inmates,',
                   'in',
                   'particular',
                   'a',
                   'character',
                   'known',
                   'only',
                   'as',
                   'Red.',
                   'Over',
                   'time',
                   'Andy',
                   'finds',
                   'ways',
                   'to',
                   'live',
                   'out',
                   'life',
                   'with',
                   'relative',
                   'ease',
                   'as',
                   'one',
                   'can',
                   'in',
                   'a',
                   'prison,',
                   'leaving',
                   'a',
                   'message',
                   'for',
                   'all',
                   'that',
                   'while',
                   'the',
                   'body',
                   'may',
                   'be',
                   'locked',
                   'away',
                   'in',
                   'a',
                   'cell,',
                   'the',
                   'spirit',
                   'can',
                   'never',
                   'be',
                   'truly',
                   'imprisoned.',
                   'Dave',
                   'Moody']
length = len(list1)
plot2 = "The Godfather Don Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter's wedding. Michael, Vito's youngest son and a decorated WW II Marine is also present at the wedding. Michael seems to be uninterested in being a part of the family business. Vito is a powerful man, and is kind to all those who give him respect but is ruthless against those who do not. But when a powerful and treacherous rival wants to sell drugs and needs the Don's influence for the same, Vito refuses to do it. What follows is a clash between Vito's fading old values and the new ways which may cause Michael to do the thing he was most reluctant in doing and wage a mob war against all the other mafia families which could tear the Corleone family apart."

plot = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency. Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit. The film portrays the man's unique way of dealing with his new, torturous life; along the way he befriends a number of fellow prisoners, most notably a wise long-term inmate named Red.::J-S-Golden After the murder of his wife, hotshot banker Andrew Dufresne is sent to Shawshank Prison, where the usual unpleasantness occurs. Over the years, he retains hope and eventually gains the respect of his fellow inmates, especially longtime convict \"Red\" Redding, a black marketeer, and becomes influential within the prison. Eventually, Andrew achieves his ends on his own terms.::Reid Gagle Andy Dufresne is sent to Shawshank Prison for the murder of his wife and her secret lover. He is very isolated and lonely at first, but realizes there is something deep inside your body that people can't touch or get to....'HOPE'. Andy becomes friends with prison 'fixer' Red, and Andy epitomizes why it is crucial to have dreams. His spirit and determination lead us into a world full of imagination, one filled with courage and desire. Will Andy ever realize his dreams?::Andy Haque Bank Merchant Andy Dufresne is convicted of the murder of his wife and her lover, and sentenced to life imprisonment at Shawshank prison. Life seems to have taken a turn for the worse, but fortunately Andy befriends some of the other inmates, in particular a character known only as Red. Over time Andy finds ways to live out life with relative ease as one can in a prison, leaving a message for all that while the body may be locked away in a cell, the spirit can never be truly imprisoned.::Dave Moody"
middle_index = length // 2

first_half = list1[:middle_index]
second_half = list1[middle_index:]

def removeCharacters(string):
    first = string.replace("::", " ")
    second = first.replace("\"", " ")
    return second
def splitPlot(list):
    result = []
   
    if len(list) > 7:
        
        first = list[0:7]
        
        length = len(list)
        last = list[7:length]
        obj = {
        "plot": first,
        "metaplot": last
        }
        result.append(obj)
     
        return result
    else:
        
        obj = {
        "plot": list,
        "metaplot": []
        }
        result.append(obj)
    return result

prettyPlot = removeCharacters(plot)

tokenizer_words = TweetTokenizer()
tokens_sentences = [tokenizer_words.tokenize(t) for t in nltk.sent_tokenize(prettyPlot)]
splitted = splitPlot(tokens_sentences)
plot = splitted[0]['plot']
metaplot = splitted[0]['metaplot']

def te(l):
    result = []
    for x in l:
        ic(type(x))
        new = ' '.join(x)
        
        result.append(new)
    return result
joined = te(plot)
for x in joined:
    ic(x)


textsample ="This thing seemed to overpower and astonish the little dark-brown dog, and wounded him to the heart. He sank down in despair at the child's feet. When the blow was repeated, together with an admonition in childish sentences, he turned over upon his back, and held his paws in a peculiar manner. At the same time with his ears and his eyes he offered a small prayer to the child."  
_sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')

def split_sentence(text):
  # Split text.
  sentences = _sent_detector.tokenize(text)
  # Find each sentence's offset.
  needle = 0
  triples = []
  for sent in sentences:
      start = text.find(sent, needle)
      end = start + len(sent) - 1
      needle += len(sent)
      triples.append((sent, start, end))
  # Return results
  return triples


    
    
texts = [
"""Here’s to the crazy ones, the misfits, the rebels, the troublemakers, the round pegs in the square holes. The ones who see things differently — they’re not fond of rules. You can quote them, disagree with them, glorify or vilify them, but the only thing you can’t do is ignore them because they change things. They push the human race forward, and while some may see them as the crazy ones, we see genius, because the ones who are crazy enough to think that they can change the world, are the ones who do.""" ,
 
'I choose a lazy person to do a hard job. Because a lazy person will find an easy way to do it.'
]
df = pd.DataFrame({'author': ['jobs', 'gates'], 'text':plot2})
ic(type(tokens_sentences), len(tokens_sentences))

