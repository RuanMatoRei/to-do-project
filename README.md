# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

### 1. Clone o projeto para o seu PC

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
2. Instale as dependências
bash

# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install

3. Crie o arquivo .env
Crie um arquivo .env na raiz do projeto e adicione as variáveis abaixo:

JWT_KEY="sua_chave_secreta_aqui"
DATABASE_URL="file:./dev.db"
Dica:

A JWT_KEY é usada para autenticação JWT.

O DATABASE_URL define o banco de dados SQLite local do Prisma.

4. Configure o Prisma
Execute o comando abaixo para criar o banco e aplicar o schema do Prisma:

bash
Copiar código
npx prisma db push
Isso vai gerar o arquivo dev.db e configurar as tabelas automaticamente.

Development Server
Start the development server on http://localhost:3000:

# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
Production
Build the application for production:

# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
Locally preview production build:

bash
Copiar código
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
Check out the deployment documentation for more information.

yaml
Copiar código

---

Quer que eu adicione no final uma seção tipo **“💡 Problemas comuns e soluções”**, para ajudar quem fo
