# 🚀 Smart AI Product Chatbot

A QR-based AI assistant that enables product companies to offer intelligent voice/text chat experiences to customers. Powered by Amazon Bedrock, OpenSearch, DynamoDB, and AWS Lambda.

## 🧭 Project Overview
**Objective:** Allow businesses to embed product information via an admin dashboard. Users scan product QR codes to interact with an AI chatbot that knows product details and company information.

## ✨ Key Features
- **Admin Dashboard**: Add company info, products, and bot behavior
- **QR Generation**: Unique QR per product linking to chatbot
- **Voice+Text Chat**: Natural conversations powered by Titan LLM
- **Real-time Responses**: Vector search + LLM generation
- **Automatic Summarization**: Convert idle chats to leads/cases
- **Secure Architecture**: IAM roles and secret management

## 🧱 Tech Stack
### Core AWS Services
| Service          | Purpose                          |
|------------------|----------------------------------|
| **Amazon Bedrock** | Titan Embed (text vectors), Titan Text (LLM) |
| **OpenSearch**   | Vector storage & KNN search      |
| **DynamoDB**     | Store admin, product, chat data  |
| **Lambda**       | Backend logic (Node.js/Python)   |
| **API Gateway**  | Frontend access point            |
| **Polly**        | Text-to-speech conversion        |
| **S3**           | QR code + audio storage          |
| **EventBridge**  | Scheduled summarization          |

### Application Layer
- **Admin Panel**: Node.js + Express + Bootstrap
- **Chat UI**: Vanilla JS + HTML/CSS
- **QR Generation**: `qrcode` npm package

## 📂 Project Structure
- **smart-ai-products/**
  - **project-root/** - Admin system
    - *backend/* - Node.js server (Express)
    - *frontend/* - Admin UI (HTML/JS)
  - **chatbot-frontend/** - User-facing chat
    - *public/* - Chat interface
    - *server.js* - UI server
  - **lambda-functions/** - AWS Lambda code
    - *adminEmbed.js* - Embed company info
    - *productEmbed.js* - Embed product data
    - *respondBot.py* - Chat response handler
    - *summarizer.py* - Chat summarization
## ⚙️ Core Workflows

### 👨‍💼 Admin Flow
1. **Add Company Details**:  
   Admin enters company information through the admin UI → Stored in DynamoDB `AdminDetails` table

2. **Add Product Information**:  
   Admin adds product details + bot behavior → Stored in DynamoDB `ProductInfo` table

3. **Automatic Embedding**:  
   DynamoDB Stream triggers Lambda functions:
   - `adminEmbed.js`: Embeds company info to OpenSearch
   - `productEmbed.js`: Chunks and embeds product data to OpenSearch

4. **QR Generation**:  
   Unique QR code generated per product → Stored in S3

### 👤 User Flow
1. **Initiate Chat**:  
   User scans product QR code → Opens chat UI with `product_id` parameter

2. **Process Message**:  
   User sends message → API Gateway → `respondBot.py` Lambda:
   - Embeds query using Titan Embed
   - Performs KNN search in OpenSearch
   - Retrieves product behavior from DynamoDB
   - Generates reply using Titan Text
   - Converts to speech using Polly
   - Stores audio in S3 → Returns signed URL + text

3. **Store Interaction**:  
   Message stored in `ChatHistory` table with timestamp

### 🔄 Summarization (Every 10 min)
1. **Trigger**: EventBridge scheduled rule activates `summarizer.py`
2. **Process**: Scans DynamoDB for chats inactive >1 hour
3. **Extract**: Creates summary + identifies user details
4. **Classify**: Marks as lead or case
5. **Update**: Modifies chat record in DynamoDB

## 🚀 Deployment

### Prerequisites
- AWS account with Bedrock access
- Node.js v18+
- Python 3.9+
- AWS CLI configured

### Setup Steps
- **Create DynamoDB Tables**:
  ```bash
  # AdminDetails table
  aws dynamodb create-table \
    --table-name AdminDetails \
    --attribute-definitions AttributeName=admin_id,AttributeType=S \
    --key-schema AttributeName=admin_id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

  # ProductInfo table
  aws dynamodb create-table \
    --table-name ProductInfo \
    --attribute-definitions AttributeName=product_id,AttributeType=S \
    --key-schema AttributeName=product_id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
- **Deploy Lambda Functions**:
   cd lambda-functions

# Admin Embed function
zip adminEmbed.zip adminEmbed.js
aws lambda create-function \
  --function-name adminEmbed \
  --runtime nodejs18.x \
  --handler adminEmbed.handler \
  --role YOUR_LAMBDA_ROLE_ARN \
  --zip-file fileb://adminEmbed.zip

# Product Embed function
zip productEmbed.zip productEmbed.js
aws lambda create-function \
  --function-name productEmbed \
  --runtime nodejs18.x \
  --handler productEmbed.handler \
  --role YOUR_LAMBDA_ROLE_ARN \
  --zip-file fileb://productEmbed.zip

# Respond Bot function
zip respondBot.zip respondBot.py
aws lambda create-function \
  --function-name respondBot \
  --runtime python3.9 \
  --handler respondBot.lambda_handler \
  --role YOUR_LAMBDA_ROLE_ARN \
  --zip-file fileb://respondBot.zip

# Summarizer function
zip summarizer.zip summarizer.py
aws lambda create-function \
  --function-name summarizer \
  --runtime python3.9 \
  --handler summarizer.lambda_handler \
  --role YOUR_LAMBDA_ROLE_ARN \
  --zip-file fileb://summarizer.zip
- **Configure Triggers**
  # Add DynamoDB stream to adminEmbed Lambda
aws lambda create-event-source-mapping \
  --function-name adminEmbed \
  --event-source-arn YOUR_DYNAMODB_STREAM_ARN \
  --batch-size 100 \
  --starting-position LATEST

# Add EventBridge rule for summarizer
aws events put-rule \
  --name summarizer-schedule \
  --schedule-expression "rate(10 minutes)"

# Connect rule to Lambda
aws events put-targets \
  --rule summarizer-schedule \
  --targets "Id"="1","Arn"="arn:aws:lambda:REGION:ACCOUNT:function:summarizer"
  Run Admin Panel:

bash
cd project-root/backend
npm install
node server.js
# Access at http://localhost:5000
Run Chat UI:

bash
cd chatbot-frontend
npm install
node server.js
# Access at http://localhost:5500

📈 Future Enhancements
Real-time admin analytics dashboard

CRM integrations (Salesforce/Zoho)

Slack notifications for new leads

User profile/lead scoring system

In-chat feedback collection

👨‍💻 Author
P. V. Sai Deepak

