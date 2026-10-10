# Controle de Materiais com RBAC

![TypeScript](https://img.shields.io/badge/TypeScript-1e3a5f?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-0b1f3a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express-111827?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-1e3a5f?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## Sobre o Projeto

Aplicação desenvolvida na disciplina de Segurança no Desenvolvimento de Software (SENAI). O sistema controla o acesso a uma lista de materiais usando RBAC (Role-Based Access Control), em que cada ação depende do perfil do usuário. Nesta etapa, foi adicionada uma área de comentários por material, com validação no back-end e proteção contra ataques comuns, como XSS e SQL injection.

## RBAC

- **Cadastro:** a API valida os dados e salva a senha com hash bcrypt. O cadastro público sempre cria o perfil `user`.
- **Autenticação:** o login confere a senha e devolve um token JWT.
- **Autorização:** o middleware valida o token e o perfil antes de liberar cada rota.
- **Perfis:** `user` consulta materiais e comenta; `admin` também pode excluir materiais.
- **Regra principal:** esconder o botão no front-end é só conveniência. Quem bloqueia de fato é o back-end (401 sem token, 403 sem permissão).

## Comentários e segurança

Cada material tem uma tela de comentários onde o usuário logado pode cadastrar e visualizar comentários.

- **Exibição como texto:** o React escapa o conteúdo, sem `dangerouslySetInnerHTML`. Tags como `<script>` aparecem como texto literal.
- **Validação no back-end:** o comentário precisa ser texto, com 1 a 500 caracteres depois do `trim`. Outros tipos (número, array, objeto, `null`) retornam 400.
- **SQL injection:** todas as consultas usam parâmetros (`?`), sem concatenar texto no SQL.
- **Autor confiável:** o `user_id` vem do token, nunca do corpo da requisição.
- **Limite de corpo:** o JSON é limitado a 10 KB (resposta 413).
- **Caracteres especiais:** acentos, aspas e emoji são mantidos (conexão e tabela em `utf8mb4`).
- **Integridade:** ao excluir um material, os comentários dele também são removidos.

## Instalação e execução

1. Clone o repositório e use o MySQL instalado na máquina.
2. No MySQL Workbench, abra `backend/sql/users.sql` e execute (raio). O script cria `users`, `materials` e `material_comments`, e pode ser rodado mais de uma vez sem apagar dados.
3. Crie `backend/.env` com `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `JWT_SECRET` (mínimo de 32 caracteres).
4. Inicie o back-end:
   - cd backend
   - npm install
   - npm start
5. Em outro terminal, inicie o front-end:
   - cd frontend/desi20251
   - npm install
   - npm run dev
6. Abra http://localhost:3000, cadastre uma conta e faça login.

O back-end roda em http://localhost:8081 e o front-end em http://localhost:3000. Para testar o perfil `admin`, altere o campo `role` da conta no banco e faça login de novo. No Windows, use `npm.cmd` se o PowerShell bloquear o `npm`.