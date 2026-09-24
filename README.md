# IDP Report (Vercel)

Site de **página única** que replica o visual da aba **Duplicata de Duplicata de Capa** do arquivo `Modelo - IDP v2.pbix`, no mesmo espírito do deploy Next.js do repositório `sada-test`.

## Stack

- Next.js 15 (App Router)
- Dados estáticos em `data/report.json` gerados a partir do `.pbix`
- Deploy na Vercel via `vercel.json` (`framework: nextjs`)

## Desenvolvimento local

```bash
pip install pbixray
npm install
npm run build:data
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Atualizar dados do Power BI

1. Substitua ou edite `Modelo - IDP v2.pbix` na raiz do repositório.
2. Rode `npm run build:data` (opcional: passe o nome do jogador como argumento do script Python).
3. Commit de `data/report.json` e dos assets em `public/pbix-assets/` se o PBIX trouxer imagens novas.

## Deploy na Vercel

1. Importe o repositório no dashboard da Vercel.
2. Framework detectado: **Next.js**.
3. Build command: `npm run build` (opcional: `npm run build:data && npm run build` se quiser regenerar JSON no CI).
4. Output: padrão do Next.js.

## Estrutura

- `app/` — rota única (`/`)
- `components/` — canvas escalável, pills de nota, radar MoG
- `lib/layout.ts` — posições extraídas do layout Power BI (1280×720)
- `scripts/build_site_data.py` — exportação do PBIX para JSON
