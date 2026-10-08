# Aula: cadastro, login e controle de acesso

Projeto com Next.js, React e TypeScript no front-end e Express com MySQL no back-end.

## Preparação

1. Instale e abra o Docker Desktop.
2. Inicie o MySQL na raiz do projeto:

   ```powershell
   docker compose --env-file backend/.env up -d
   ```

   O banco e as tabelas são criados automaticamente na primeira inicialização.
   O serviço usa as variáveis `DB_NAME` e `DB_PASSWORD` de `backend/.env`.
3. Inicie o back-end seguindo [backend/README.md](backend/README.md).
4. Na pasta `frontend/desi20251`, execute `npm install` e `npm run dev`.
5. Abra http://localhost:3000, clique em **Cadastrar usuário** e crie uma conta com seus próprios dados.
6. Faça login para consultar os materiais. Para testar administrador, siga a alteração de perfil no banco descrita no README do back-end.

Para parar o banco sem apagar os dados, execute `docker compose stop`. Para
iniciá-lo novamente, use `docker compose --env-file backend/.env up -d`.
Os dados ficam no volume `mysql_data`; remover esse volume apaga o banco.

No Windows, use `npm.cmd` se o PowerShell bloquear `npm.ps1`.

## Conceitos da aula

- Cadastro: a API valida os dados e salva a senha com hash bcrypt.
- Autenticação: o login verifica a senha e retorna um token JWT.
- Autorização: o middleware verifica o token e o perfil antes de permitir a operação.
- `user` consulta materiais; `admin` também pode excluir.
- O cadastro público sempre cria `user`. O perfil não é escolhido pelo formulário.
- A sessão fica na memória do front-end; recarregar a página exige outro login.

Os arquivos de cadastro são `backend/src/controllers/register.js`, `frontend/desi20251/app/services/register.ts` e `frontend/desi20251/app/page/Register.tsx`. Eles possuem comentários para acompanhar o fluxo.

Consulte o [roteiro do front-end](frontend/desi20251/README.md) para a atividade completa.

## Verificação

No back-end, execute `npm test`. No front-end, execute `npm run lint` e `npm run build`. Os testes HTTP usam banco simulado; a integração com MySQL precisa do banco configurado.
