# Back-end: login, cadastro e permissões

## Executar

1. Instale as dependências com `npm install`.
2. Configure `.env` usando `.env.example`: conexão com MySQL e `JWT_SECRET` com pelo menos 32 caracteres.
3. Na raiz do projeto, inicie o MySQL com Docker:

   ```powershell
   docker compose --env-file backend/.env up -d
   ```

   O Compose cria o banco indicado em `DB_NAME` e executa `sql/users.sql` na
   primeira inicialização. O script cria as tabelas de usuários e materiais e
   insere materiais de exemplo, mas não cadastra contas prontas.
4. Execute `npm start`. A API usa a porta 8081 por padrão e conecta ao banco em `localhost`.

Se já houver um banco no volume, o MySQL não executa novamente os scripts de
inicialização. O comando antigo `npm run seed` depende de um arquivo ausente
neste projeto.

## Cadastro explicado

- `src/controllers/register.js`: valida nome, e-mail e senha; verifica duplicidade; gera o hash com bcrypt; salva com SQL parametrizado.
- `src/routers/auth.js`: publica `POST /api/register` e `POST /api/login`.
- `sql/users.sql`: define a tabela e impede e-mails duplicados com UNIQUE.

O cadastro recebe `name`, `email` e `password`. Nome aceita até 100 caracteres, e-mail até 254 e senha pelo menos 8 caracteres e no máximo 72 bytes (limite do bcrypt). A senha original não é salva nem devolvida.

A resposta de sucesso é HTTP 201 com uma mensagem. Dados inválidos retornam 400 e e-mail já cadastrado retorna 409. O aluno volta ao login para obter seu token.

## Perfis

O cadastro público sempre cria `user`, que pode consultar materiais. O perfil `admin` também pode excluir. Enviar `role: "admin"` no cadastro não concede essa permissão.

Para a atividade, o professor pode executar no banco, substituindo o e-mail pelo da conta criada:

```sql
UPDATE users SET role = 'admin' WHERE email = 'email-da-conta-cadastrada';
```

Depois, saia e entre novamente: o perfil do token é definido no login.

## Rotas

- `POST /api/register`: cadastro público.
- `POST /api/login`: login público; devolve token e dados do usuário.
- `GET /api/materials`: consulta autenticada para os dois perfis.
- `DELETE /api/materials/:id`: exclusão apenas para admin.

As rotas protegidas recebem `Authorization: Bearer SEU_TOKEN`.

## Testes

Execute `npm test`. Os testes fazem chamadas HTTP com banco simulado e verificam cadastro, hash, duplicidade, validação, login e permissões. A integração com o MySQL deve ser conferida com o banco da aula.
