# fc-monolito

Desafio Full Cycle — Sistemas Monolíticos: Módulo de Invoice.

## Sobre

Implementação do **Módulo de Invoice** dentro de um monolito modular em TypeScript, seguindo os padrões de Facade, Factory, Domain, Gateway, Repository e Use Cases.

## Módulo Invoice

```
src/modules/invoice/
├── domain/
│   ├── invoice.entity.ts
│   └── invoice-items.entity.ts
├── gateway/
│   └── invoice.gateway.ts
├── usecase/
│   ├── generate-invoice/
│   └── find-invoice/
├── repository/
│   ├── invoice.model.ts
│   ├── invoice-items.model.ts
│   └── invoice.repository.ts
├── facade/
│   ├── facade.interface.ts
│   ├── invoice.facade.ts
│   └── invoice.facade.spec.ts
└── factory/
    └── invoice.facade.factory.ts
```

## Pré-requisitos

- Node.js >= 18
- pnpm

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
pnpm test
```

Rodar apenas o módulo de invoice:

```bash
pnpm test -- --testPathPattern invoice
```
