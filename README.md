# Real-Time Chat Application

## Descrição

Esta é uma aplicação de chat em tempo real desenvolvida utilizando Node.js, Express, React e Vite. O servidor WebSocket recebe mensagens dos clientes e exibe-as para o administrador em tempo real. A página do administrador é construída com React e Vite.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```

2. Instale as dependências do servidor:

```bash
cd nome-do-repositorio/server
npm install
```

3. Instale as dependências do frontend:

```bash
cd ../frontend
npm install
```

## Configuração

1. Crie um arquivo `.env` na pasta `server` com as seguintes configurações:

```env
PORT=3000
SECRET_KEY=your_secret_key
```

Substitua `your_secret_key` por uma chave secreta para assinar tokens JWT.

## Execução

1. Inicie o servidor:

```bash
cd server
npm start
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
cd ../server
npm start
```

O servidor estará disponível em http://localhost:3000.

## Licença

Este projeto está licenciado sob a Licença GNU GPLv3. Consulte o arquivo LICENSE para obter mais detalhes.