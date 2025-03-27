import os
import openai
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from django.conf import settings


from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")

# OpenAI APIキーの設定
openai.api_key = OPENAI_API_KEY

# LangChain の埋め込みモデル
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# FAISS インデックスを読み込む
faiss_index_dir = os.path.dirname(settings.FAISS_INDEX_PATH)
faiss_index = FAISS.load_local(faiss_index_dir, embedding_model, allow_dangerous_deserialization=True)



# クエリをベクトル化して最も関連性の高いドキュメントを取得
def search_documents(query):
    """ユーザーのクエリを受けて関連ドキュメントを検索"""
    

    # クエリをベクトル化
    query_vector = embedding_model.embed_documents([query])[0] 
    documents = faiss_index.similarity_search_by_vector(query_vector, k=3)
    
    return documents

# OpenAI API を使って回答を生成
def generate_answer(query, documents):
    """OpenAI API を使用して回答を生成"""
    context = "\n\n".join([doc.page_content for doc in documents])  # 検索されたドキュメントをコンテキストに追加
    
    # OpenAIを使って回答生成
    response = openai.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": "あなたは有能なアシスタントです。以下の情報を参考にしてユーザの質問に回答して"},
            {"role": "assistant", "content": context},
            {"role": "user", "content": f"質問を入力してください: {query}"},
        ],
        max_tokens=100 
    )
    
    answer = response.choices[0].message.content
    return answer

def answer_query(query):
    """クエリに対して回答を生成する関数"""
    # クエリに関連するドキュメントを検索
    documents = search_documents(query)
    
    answer = generate_answer(query, documents)
    
    return answer
