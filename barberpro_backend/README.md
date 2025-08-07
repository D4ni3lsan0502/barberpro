# BarberPro Backend

Backend robusto para o aplicativo BarberPro, desenvolvido com Flask e MongoDB.

## Funcionalidades

- API RESTful completa para gerenciamento de barbeiros, clientes, serviços e agendamentos
- Autenticação JWT para barbeiros e clientes
- Integração com MongoDB para persistência de dados
- Frontend integrado servido pelo backend
- CORS configurado para requisições cross-origin

## Estrutura do Projeto

```
barberpro_backend/
├── src/
│   ├── models/          # Modelos de dados (MongoDB)
│   ├── routes/          # Rotas da API
│   ├── static/          # Frontend (HTML, CSS, JS)
│   ├── database.py      # Configuração do banco de dados
│   └── main.py          # Aplicação Flask principal
├── requirements.txt     # Dependências Python
├── Procfile            # Configuração para Railway
└── README.md           # Este arquivo
```

## Deploy no Railway

### Pré-requisitos

1. Conta no Railway (https://railway.app)
2. Banco de dados MongoDB (MongoDB Atlas recomendado)

### Passos para Deploy

1. **Conecte seu repositório ao Railway:**
   - Faça login no Railway
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte este repositório

2. **Configure as variáveis de ambiente:**
   - No painel do Railway, vá para "Variables"
   - Adicione as seguintes variáveis:
     ```
     MONGO_URI=sua_string_de_conexao_mongodb
     JWT_SECRET_KEY=sua_chave_secreta_jwt
     SECRET_KEY=sua_chave_secreta_flask
     ```

3. **Deploy automático:**
   - O Railway detectará automaticamente o Procfile
   - O deploy será iniciado automaticamente
   - Aguarde a conclusão do build e deploy

### Configuração do MongoDB

Para usar MongoDB Atlas:

1. Crie uma conta no MongoDB Atlas
2. Crie um cluster gratuito
3. Configure o acesso de rede (adicione 0.0.0.0/0 para acesso de qualquer IP)
4. Crie um usuário de banco de dados
5. Obtenha a string de conexão e configure na variável `MONGO_URI`

Exemplo de string de conexão:
```
mongodb+srv://usuario:senha@cluster.mongodb.net/barberpro_db?retryWrites=true&w=majority
```

## Desenvolvimento Local

### Instalação

```bash
pip install -r requirements.txt
```

### Configuração

1. Copie `.env.example` para `.env`
2. Configure as variáveis de ambiente no arquivo `.env`
3. Certifique-se de que o MongoDB está rodando localmente ou configure uma conexão remota

### Execução

```bash
cd src
python main.py
```

O servidor estará disponível em `http://localhost:5000`

## API Endpoints

### Autenticação
- `POST /api/login` - Login de barbeiro ou cliente
- `POST /api/register` - Registro de novo usuário

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `GET /api/clients/<id>` - Obter cliente específico
- `PUT /api/clients/<id>` - Atualizar cliente
- `DELETE /api/clients/<id>` - Deletar cliente

### Barbeiros
- `GET /api/barbers` - Listar barbeiros
- `POST /api/barbers` - Criar barbeiro
- `GET /api/barbers/<id>` - Obter barbeiro específico
- `PUT /api/barbers/<id>` - Atualizar barbeiro
- `DELETE /api/barbers/<id>` - Deletar barbeiro

### Serviços
- `GET /api/services` - Listar serviços
- `POST /api/services` - Criar serviço
- `GET /api/services/<id>` - Obter serviço específico
- `PUT /api/services/<id>` - Atualizar serviço
- `DELETE /api/services/<id>` - Deletar serviço

### Agendamentos
- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `GET /api/appointments/<id>` - Obter agendamento específico
- `PUT /api/appointments/<id>` - Atualizar agendamento
- `DELETE /api/appointments/<id>` - Deletar agendamento
- `GET /api/appointments/available-times/<barber_id>/<date>` - Obter horários disponíveis

## Tecnologias Utilizadas

- **Flask** - Framework web Python
- **MongoDB** - Banco de dados NoSQL
- **PyMongo** - Driver MongoDB para Python
- **Flask-JWT-Extended** - Autenticação JWT
- **Flask-CORS** - Suporte a CORS
- **Gunicorn** - Servidor WSGI para produção

## Licença

Este projeto é privado e proprietário.

