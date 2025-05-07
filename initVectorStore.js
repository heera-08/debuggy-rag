// initVectorStore.js - Script to initialize and seed the vector store
require('dotenv').config();
const { MemoryVectorStore } = require('langchain/vectorstores/memory');
//GROQ EMBEDDINGS IS NOT WORKING OUT SO i AM USING HUGGING FACE LOCALLY
//const { GroqEmbeddings } = require('@langchain/groq');

const { HuggingFaceTransformersEmbeddings } = require('@langchain/community/embeddings/hf_transformers');
// I MADE A SPELLING MISTAKE WHILE TYPING, AND LEFFT THE COMMUNITY [PART] BE CAREFUL


const fs = require('fs');
const path = require('path');
const { readBugExamples } = require('./utils');

// Initial bug examples with solutions to seed the database
const INITIAL_EXAMPLES = [
  {
    bug: "TypeError: Cannot read property 'map' of undefined in React component",
    solution: "This error occurs when you're trying to use .map() on a variable that is undefined or null. Make sure your data is properly initialized and has a default value: `const [data, setData] = useState([])` or use conditional rendering: `{data && data.map(item => ...)}`"
  },
  {
    bug: "CORS error: Access-Control-Allow-Origin missing",
    solution: "The CORS error happens when making requests to a different domain that doesn't allow your origin. On the server side, add headers: `res.header('Access-Control-Allow-Origin', '*')` or use a CORS middleware like `app.use(cors())`."
  },
  {
    bug: "JavaScript promise pending in console.log",
    solution: "When you console.log a Promise directly, it shows as pending. To see the resolved value, use async/await: `const data = await myPromise` or use .then(): `myPromise.then(data => console.log(data))`."
  },
  {
    bug: "Node.js Error: Cannot find module",
    solution: "This error means Node can't locate the specified module. Check if the module is installed (run `npm install <module-name>`), verify the path if it's a local module, and check for typos in the import statement."
  },
  {
    bug: "React state not updating immediately after setState",
    solution: "React's setState is asynchronous. To execute code after state updates, use the callback form or useEffect: `useEffect(() => { /* code that depends on state */ }, [stateVariable]);`"
  }
];

const initVectorStore = async () => {
  try {
    console.log("Initializing vector store...");
    
    // For the embeddings initialization:
const embeddings = new HuggingFaceTransformersEmbeddings({
    modelName: "Xenova/all-MiniLM-L6-v2",
  });
    
    // Create documents from initial examples and any saved examples
    let documents = [...INITIAL_EXAMPLES];
    
    // Try to add existing examples from file
    try {
      const savedExamples = readBugExamples();
      if (savedExamples && savedExamples.length > 0) {
        documents = [...documents, ...savedExamples];
      }
    } catch (e) {
      console.log("No existing examples found, using initial examples only.");
    }
    
    // Prepare documents for vector store
    const docs = documents.map(doc => ({
      pageContent: `Bug: ${doc.bug}\nSolution: ${doc.solution}`,
      metadata: { source: "bug-database" }
    }));
    
    // Create vector store
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
    console.log(`Vector store initialized with ${docs.length} documents`);
    
    return vectorStore;
  } catch (error) {
    console.error("Error initializing vector store:", error);
    throw error;
  }
};

module.exports = { initVectorStore };
