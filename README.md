# Real-Time Chat Application

## Descrição

Esta é uma aplicação de chat em tempo real desenvolvida utilizando Node.js, Express, React e Vite. O servidor WebSocket recebe mensagens dos clientes e exibe-as para o administrador em tempo real. A página do administrador é construída com React e Vite.

## Estrutura do projeto

O projeto traz tanto o frontend do cliente (usuário final do site com a integração do chat) quanto o servidor, que, por sua vez, contém tanto um painel de administrador com autenticação (`server/frontend`) quanto o servidor Node.js com toda a lógica do WebSocket do chat (`server/backend`).

## Tecnologias usadas
    1. Cliente (`./client`)
        - HTML, CSS e Javascript
    2. Frontend Servidor (`./server/frontend`)
        - React (Javascript) e Vite (Para a build estática do frontend)
    3. Backend Servidor (`./server/backend`)
        - Node.js e Express

Outras bibliotecas e dependências do projeto estão disponíveis nos arquivos package.json
    `server/backend/package.json` e `server/frontend/package.json`
   

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```

2. Instale as dependências do servidor:

```bash
cd nome-do-repositorio/server/backend
npm install
```

3. Instale as dependências do frontend:

```bash
cd ../frontend
npm install
```

## Configuração

1. Crie um arquivo `.env` na pasta `server/backend` com as seguintes configurações:

```env
PORT=3000
ADMINID="adminKey"

USERNAME="your_user"
PASSWORD="your_password"

JWT_SECRET="your_secret_key"

NODE_ENV="development"
NODE_URL="http://localhost"
```

Substitua `your_secret_key` por uma chave secreta para assinar tokens JWT.

## Execução

1. Inicie o servidor:

```bash
cd server/backend
npm run start
```

O servidor estará disponível em http://localhost:3000.

2. Inicie o frontend (opcional, se já estiver em modo de produção):

```bash
cd ../frontend
npm run dev
```

O frontend estará disponível em http://localhost:3000.

## Modo de Produção

Para executar a aplicação em modo de produção, você precisará construir o frontend e iniciar o servidor.

1. Construa o frontend:

```bash
cd ../frontend
npm run build
```

2. Inicie o servidor:

```bash
cd ../server/backend
npm start
```

O servidor estará disponível em http://localhost:3000.

## Licença

Este projeto está licenciado sob a Licença GNU GPLv3. Consulte o arquivo LICENSE para obter mais detalhes.