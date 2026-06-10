# fc-monolito

Monólito modular desenvolvido nos desafios de Sistemas Monolíticos da Full Cycle.

## Sobre

Monólito modular em TypeScript com módulos de product-adm, store-catalog,
client-adm, checkout, payment e invoice. O projeto segue os padrões de Domain,
Gateway, Repository, Use Case, Facade e Factory.

O estado atual do repositório cobre o módulo de Invoice e a camada de API com
testes End-to-End para o fluxo completo de compra.

## Desafios implementados

- Módulo Invoice.
- API REST e testes End-to-End do fluxo de compra.

## Módulos

- `product-adm`: cadastro administrativo de produtos e controle de estoque.
- `store-catalog`: consulta de produtos disponíveis para compra.
- `client-adm`: cadastro e consulta de clientes.
- `checkout`: realização de pedidos.
- `payment`: processamento de pagamentos.
- `invoice`: geração e consulta de notas fiscais.

## Endpoints

- `POST /products`: cadastra produto no administrativo e no catálogo.
- `POST /clients`: cadastra cliente.
- `POST /checkout`: realiza uma compra e gera nota fiscal quando o pagamento é aprovado.
- `GET /invoice/:id`: consulta uma nota fiscal.

## Pré-requisitos

- Node.js >= 18
- npm ou pnpm

## Instalação

```bash
pnpm install
```

> Em ambientes com Node.js >= 22, pode ser necessário recompilar o sqlite3:
> ```bash
> pnpm rebuild sqlite3
> ```

## Testes

Rodar todos os testes:

```bash
npm run test
```

Ou, usando pnpm:

```bash
pnpm test
```

Rodar apenas os testes E2E da API:

```bash
pnpm test -- --testPathPattern=src/api
```

## Servidor

```bash
npx ts-node src/api/server.ts
```
