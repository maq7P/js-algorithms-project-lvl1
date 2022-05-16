import {docs} from './moc.js';

const buildSearchEngine = (docs) => {
  return {
    search: (word) => {
      const res = [];
      for (let i = 0; i < docs.length; i++) {
        const document = docs[i];
        const docText = document.text
        const docId = document.id;
        const words = docText
          .split(" ");

        let relevance = 0
        for (let i = 0; i < words.length; i++) {
          const curWord = words[i].replace(/[,.?!]/g, "");
          curWord === word && relevance++
        }
        relevance > 0 && res.push({
          docId,
          relevance
        })
      }

      if(!res.length){
        return "Документы пусты";
      }

      return res
        .sort((doc1, doc2) => doc2.relevance - doc1.relevance )
        .map(doc => doc.docId)
    }
  }
}

const searchEngine = buildSearchEngine(docs); // поисковый движок запомнил документы

// поиск по документам
console.log(searchEngine.search('shoot')); // ['doc1', 'doc2']

const searchEngine2 = buildSearchEngine([]); // Документы пусты
searchEngine2.search(''); // []

export default buildSearchEngine;