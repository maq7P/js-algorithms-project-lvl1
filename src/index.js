import {docs} from './moc.js';

class BuildSearchEngine {
  constructor(docs) {
    this.docs = docs
  }

  static calcTF_IDF(
    termDocumentFrequency,
    documentsSize,
    collectionSize,
    termCollectionFrequency,
  ) {
    const TF = termDocumentFrequency / collectionSize;
    const IDF =  Math.log10(documentsSize / termCollectionFrequency);
    return TF * IDF;
    // Вторая формула
    //(termDocumentFrequency / documentSize) * Math.log2(1 + collectionSize / termCollectionFrequency)
  }

  #calcTargetTF_IDF(builtIndex, targetArr){
    const score = {};
    let commonFrequency = 0;

    for(let i = 0; i < targetArr.length; i++){
      const word = targetArr[i].toLowerCase();
      for(let docId in builtIndex[word]){
        commonFrequency++;
      }

      if(!commonFrequency) return {}

      for(let docId in builtIndex[word]){
        let currentFrequency = builtIndex[word][docId];

        const curScore = BuildSearchEngine.calcTF_IDF(
          commonFrequency,
          this.getSizeDocs(),
          this.getSizeDoc(docId),
          currentFrequency
        );

        score[docId] ? score[docId] += curScore : score[docId] = curScore;
      }
    }

    return score
  }

  buildIndex(docs){
    const index = {};

    for(let i = 0; i < docs.length; i++){
      const doc = docs[i];
      const docText = doc.text
      const docId = doc.id;
      const words = docText.split(" ");

      for(let i = 0; i < words.length; i++){
        const curWordInText = words[i].toLowerCase().replace(/[,.?!]/g, "");

        if(index[curWordInText]){
          index[curWordInText][docId]
            ? index[curWordInText][docId]++
            : index[curWordInText][docId] = 1
        } else {
          index[curWordInText] = {[docId]: 1}
        }
      }
    }

    return index
  }

  getSizeDocs(){
    return this.docs.length;
  }

  getSizeDoc(id){
    return this.docs
      .find(doc => doc.id === id)
      .text.split(" ").length
  }

  getPopularDoc(objDocsWithTF_IDF){
    return Object
      .entries(objDocsWithTF_IDF)
      .sort(([, ascore], [, bscore]) => bscore - ascore)
      .map(([id]) => id);
  }

  search(word){
    if(!this.docs.length) return [];

    const buildIndex = this.buildIndex(docs);
    const calculatedTargetTF_IDF = this.#calcTargetTF_IDF(buildIndex, word.split(" "));

    return this.getPopularDoc(calculatedTargetTF_IDF)
  }
}

const searchEngine = new BuildSearchEngine(docs); // поисковый движок запомнил документы

// поиск по документам
console.log(searchEngine.search('shoot'));

const searchEngine2 =  new BuildSearchEngine([]); // Документы пусты

console.log(searchEngine2.search('shoot'));

export default BuildSearchEngine;