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

        for (let i = 0; i < words.length; i++) {
          const curWord = words[i].replace(/[,.?!]/g, "");
          curWord === word && !res.includes(docId) && res.push(docId);
        }
      }

      if(!res.length){
        return "Документы пусты";
      }

      return res
    }
  }
}

const searchEngine = buildSearchEngine(docs); // поисковый движок запомнил документы

// поиск по документам
console.log(searchEngine.search('pint')); // ['doc1', 'doc2']

const searchEngine2 = buildSearchEngine([]); // Документы пусты
searchEngine2.search(''); // []

export default buildSearchEngine;