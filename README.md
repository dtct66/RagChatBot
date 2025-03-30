# RAG Chatbot

## 概要
このプロジェクトは、**Retrieval-Augmented Generation (RAG)** を活用したチャットボットアプリケーションです。  
ユーザー認証機能を備え、Django REST Framework（DRF）をバックエンド、Reactをフロントエンドとして使用しています。

## 特徴
- **RAG (Retrieval-Augmented Generation)** により、事前に学習されたデータと検索結果を組み合わせた自然な応答を生成
- **ユーザー認証機能**（登録・ログイン・ログアウト・アカウント削除）
- **Docker対応**により、環境構築が容易
- **Django REST Framework (DRF)** によるAPI設計
- **React** によるフロントエンド

## 技術スタック
- **バックエンド:** Django, Django REST Framework (DRF)
- **フロントエンド:** React
- **データベース:** PostgreSQL
- **環境構築:** Docker, Docker Compose
- **LLM (大規模言語モデル):** OpenAI API 

## インストール & セットアップ

### 1. リポジトリをクローン
```bash
git clone git@github.com:dtct66/RagChatBot.git
cd ragchatbot
```

2. **環境変数を設定**
    プロジェクトのルートに `.env` ファイルを作成し、以下のように設定します。
    ```ini
    
    POSTGRES_DB=your-database-name
    POSTGRES_USER=your-database-username
    POSTGRES_PASSWORD=your-database-password

    
    PGADMIN_DEFAULT_EMAIL=your-email
    PGADMIN_DEFAULT_PASSWORD=your-pgadmin-password


    
    OPENAI_API_KEY=your_api_key
    OPENAI_MODEL=model-name
    ```

3. **検索文章の作成と保存場所**
    ### **`rag/documents`ディレクトリの作成**
- `rag`ディレクトリ内に`documents`というディレクトリを作成します。
- このディレクトリ内にテキストファイルを追加します（例: `example.txt`）。

4. **Dockerコンテナを起動**
    Dockerコンテナをビルドして、起動します。
    ```bash
    docker-compose up --build
    ```


5. **Djangoのマイグレーション**
    マイグレーションを実行して、データベースのセットアップを行います。
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

6. **Superuserを作成 (管理画面用)**
    管理画面にアクセスするためのスーパーユーザーを作成します。
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```








