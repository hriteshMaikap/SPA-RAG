from flask import Flask, jsonify, request
from qdrant_client import QdrantClient
from langchain_qdrant import QdrantVectorStore
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
from config import config
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize Qdrant client and vector store
qdrant_client = QdrantClient(url=config.QDRANT_URL, api_key=config.QDRANT_API_KEY)
embeddings = FastEmbedEmbeddings()
vector_store = QdrantVectorStore(client=qdrant_client, collection_name=config.COLLECTION_NAME, embedding=embeddings)

# Setup retriever
retriever = vector_store.as_retriever(search_type="similarity_score_threshold", search_kwargs={"k": 3, "score_threshold": 0.5})

# Initialize Groq model
groq_chat = ChatGroq(groq_api_key=config.GROQ_API_KEY, model_name=config.MODEL_NAME)

# Helper function to format documents
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Define the generation route
@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    query = data.get("query", "What is the purpose of this document?")
    
    # Step 1: Retrieve relevant documents
    results = retriever.get_relevant_documents(query)
    context = format_docs(results)
    
    # Step 2: Define the prompt template
    prompt_template = PromptTemplate(
        input_variables=["context", "question"],
        template="""
        <s> [INST] You are an assistant for IEEE Student Branch Vishwakarma Institute of Technology Pune. You have been designed to answer
        questions pertaining to our student chapter often referred to as a club or committee. You have to diligently answer from the retrieved 
        context. Remember you represent a highly respectable Student Branch which is running from last 25 years, so all answers should be respectful
        and if the query is offensive or asks anything illegal or incorrect, do not entertain such questions. Never respond in such a way that IEEE Student Branch
        will be portrayed in a negative light. IEEE Student Branch or IEEE Club or IEEE Committee is a student body of IEEE that helps in technical activities in the college. So whenever
        a question is asked regarding IEEE, try to answer from a Student Branch perspective. Never ask someone to directly join IEEE via memberships,
        it's completely the user's choice. Mention IEEE is here to improve the coding and tech culture of the college.
        If someone wants to join IEEE, mention how they can participate in workshops, and seminars. Keep answers brief and to the point.
        [INST] Question: {question} 
        # Context: {context} 
        # Answer: [/INST]
        """
    )

    # Step 3: Chain construction and invocation
    chain = RunnablePassthrough() | prompt_template | groq_chat | StrOutputParser()
    
    try:
        # Prepare the context and question, then invoke the chain
        answer = chain.invoke({"context": context, "question": query})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    # Step 4: Return the generated answer
    return jsonify({"query": query, "answer": answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=config.DEBUG)
