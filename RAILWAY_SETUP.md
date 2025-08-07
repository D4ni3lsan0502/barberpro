# Configuração do BarberPro no Railway

## Passo a Passo para Configurar as Variáveis de Ambiente

### 1. Configurar MongoDB Atlas (Gratuito)

1. Acesse https://www.mongodb.com/atlas
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Crie um cluster gratuito (M0)
5. Configure o acesso:
   - Network Access: Adicione 0.0.0.0/0 (permitir de qualquer IP)
   - Database Access: Crie um usuário com senha
6. Obtenha a string de conexão:
   - Clique em "Connect" no seu cluster
   - Escolha "Connect your application"
   - Copie a string de conexão
   - Substitua `<password>` pela senha do usuário
   - Substitua `<dbname>` por `barberpro_db`

Exemplo de string de conexão:
```
mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/barberpro_db?retryWrites=true&w=majority
```

### 2. Configurar Variáveis no Railway

1. Acesse seu projeto no Railway
2. Vá para a aba "Variables"
3. Adicione as seguintes variáveis:

```
MONGO_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/barberpro_db?retryWrites=true&w=majority
JWT_SECRET_KEY=sua_chave_secreta_jwt_muito_segura_aqui
SECRET_KEY=sua_chave_secreta_flask_muito_segura_aqui
```

**Importante:** 
- Substitua as chaves secretas por valores únicos e seguros
- Use geradores de senha para criar chaves aleatórias
- Nunca compartilhe essas chaves

### 3. Redeploy

Após configurar as variáveis:
1. O Railway fará redeploy automaticamente
2. Aguarde alguns minutos
3. Teste a API acessando: `https://sua-url.railway.app/api/services`

### 4. Teste Completo

Para testar se tudo está funcionando:

1. **Frontend:** Acesse a URL principal
2. **API:** Teste endpoints como `/api/services`, `/api/barbers`
3. **Cadastro:** Teste o cadastro de cliente
4. **Login:** Teste o login de barbeiro/cliente

### Solução de Problemas

**Erro 500 na API:**
- Verifique se MONGO_URI está configurado corretamente
- Verifique se o usuário do MongoDB tem permissões
- Verifique se o IP está liberado no MongoDB Atlas

**Erro de CORS:**
- O CORS já está configurado no backend
- Se persistir, verifique se está fazendo requisições para a URL correta

**Erro de JWT:**
- Verifique se JWT_SECRET_KEY está configurado
- Certifique-se de que a chave é a mesma em todas as requisições

### URLs Importantes

- **Frontend:** https://qjh9iec581e9.manus.space
- **API Base:** https://qjh9iec581e9.manus.space/api
- **Exemplo de endpoint:** https://qjh9iec581e9.manus.space/api/services

### Suporte

Se encontrar problemas:
1. Verifique os logs no Railway
2. Confirme que todas as variáveis estão configuradas
3. Teste a conexão com MongoDB Atlas separadamente

