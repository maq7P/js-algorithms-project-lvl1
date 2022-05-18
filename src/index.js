import {docs} from './moc.js';

class BuildSearchEngine {
  constructor(docs) {
    this.docs = docs
  }
  static invertIndexById(docs){
    const index = {};

    for(let i = 0; i < docs.length; i++){
      const doc = docs[i];
      const docText = doc.text
      const docId = doc.id;
      const words = docText.split(" ");

      for(let i = 0; i < words.length; i++){
        const curWordInText = words[i].toLowerCase().replace(/[,.?!]/g, "");

        index[curWordInText] && !index[curWordInText].includes(docId) && index[curWordInText].push(docId);
        !index[curWordInText] && (index[curWordInText] = [docId]);
      }
    }

    return index
  }

  search(word){
    const wordArr = word.split(" ");

    const res = [];
    for (let i = 0; i < wordArr.length; i++){
      const word = wordArr[i].toLowerCase().replace(/[,.?!]/g, "");
      const target = BuildSearchEngine.invertIndexById(this.docs)[word];
      target && res.push(...target);
    }

    return [...new Set(res)];
  }
}

const searchEngine = new BuildSearchEngine(docs); // поисковый движок запомнил документы

// поиск по документам
console.log(searchEngine.search('shoot kke')); // ['doc1', 'doc2']

const searchEngine2 =  new BuildSearchEngine([]); // Документы пусты
console.log(searchEngine2.search('')); // []

export default BuildSearchEngine;