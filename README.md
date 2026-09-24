# IDP Report (Vercel)

Site de **página única** com o relatório de desenvolvimento individual (IDP), alimentado pelos dados do arquivo `Modelo - IDP v2.pbix` e no mesmo espírito do deploy Next.js do repositório `sada-test`.

## Conteúdo da página

- **Cabeçalho do atleta** — nome, posição, clube, nascimento, idade, altura e links externos
- **Performance Indicators** — notas técnicas com escala visual de 4 níveis e legenda
- **Player-Specific Indicators** — indicadores específicos do atleta
- **Need to Improve** — de 4 a 6 itens, **editáveis no próprio site** (persistidos no `localStorage` do navegador)

## Stack

- Next.js 15 (App Router), layout responsivo próprio (sem imagem de fundo do Power BI)
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
2. Rode `npm run build:data` (opcional: passe o nome do jogador como argumento, ex. `python3 scripts/build_site_data.py "Player Name"`).
3. Commit de `data/report.json`.

Os itens de **Need to Improve** vindos do PBIX são o padrão da página; a edição feita no site fica apenas no navegador de quem editou e pode ser desfeita com o botão **Restaurar**.

## Deploy na Vercel

1. Importe o repositório no dashboard da Vercel.
2. Framework detectado: **Next.js**.
3. Build command: `npm run build` (opcional: `npm run build:data && npm run build` se quiser regenerar JSON no CI).
4. Output: padrão do Next.js.

## Estrutura

- `app/page.tsx` — rota única (`/`)
- `app/globals.css` — design system (cores, cards, badges, responsivo, estilos de impressão)
- `components/IdpReport.tsx` — montagem das seções
- `components/ImprovementsPanel.tsx` — edição dos itens de Need to Improve
- `components/GradeBadge.tsx`, `IndicatorGrid.tsx`, `GradeLegend.tsx` — notas e indicadores
- `lib/report.ts` — tipos e escala de notas
- `scripts/build_site_data.py` — exportação do PBIX para JSON
