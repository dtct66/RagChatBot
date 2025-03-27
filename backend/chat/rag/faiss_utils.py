import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS



embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


DOCS_PATH = os.path.join(os.path.dirname(__file__), "documents")


FAISS_INDEX_PATH = os.path.join(os.path.dirname(__file__), "faiss_index")

def load_documents():
    """documents/ フォルダ内の .txt ファイルを読み込む"""
    documents = []
    file_names = []
    
    for file_name in os.listdir(DOCS_PATH):
        if file_name.endswith(".txt"):
            with open(os.path.join(DOCS_PATH, file_name), "r", encoding="utf-8") as f:
                text = f.read().strip()
                documents.append(text)
                file_names.append(file_name)
    
    return documents, file_names

def create_faiss_index():
    """FAISS インデックスを作成して保存"""
    try:
        documents, file_names = load_documents()
        
        if not os.path.exists(FAISS_INDEX_PATH):
            os.mkdir(FAISS_INDEX_PATH)
            print(f"✅ ディレクトリ '{FAISS_INDEX_PATH}' を作成しました！")


        faiss_index = FAISS.from_texts(texts=documents, embedding=embedding_model)

        faiss_index.save_local(FAISS_INDEX_PATH)
        
        print(f"✅ FAISS インデックスを作成・保存しました！ ({FAISS_INDEX_PATH})")
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")

if __name__ == "__main__":
    create_faiss_index()
