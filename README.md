# INATEL_C14_PROJETO_FRONTEND

Frontend do **Rateio**, projeto da disciplina C14 (Engenharia de Software) do Inatel.

## Índice

- [Descrição do projeto](#descrição-do-projeto)
- [Requisitos funcionais](#requisitos-funcionais)
- [Requisitos não funcionais](#requisitos-não-funcionais)
- [Histórias de usuário e rastreabilidade](#histórias-de-usuário-e-rastreabilidade)
- [Metodologia e dinâmica de desenvolvimento](#metodologia-e-dinâmica-de-desenvolvimento)
- [Refactorings aplicados](#refactorings-aplicados)
- [Como testar](#como-testar)
- [Como executar](#como-executar)
- [Tecnologias e ferramentas](#tecnologias-e-ferramentas)
- [Uso de IA](#uso-de-ia)

## Descrição do projeto

Aplicação web em **Next.js (App Router) + React + TypeScript** que consome a API REST do **Rateio** para dividir despesas entre membros de um grupo: permite criar conta e autenticar-se, gerenciar grupos e participantes, registrar despesas com três estratégias de divisão (`IGUAL`, `POR_PESO` e `VALORES_FIXOS`), consultar saldos consolidados e o plano de quitação mínima sugerido, registrar pagamentos entre membros, realizar estornos lógicos e auditar o extrato cronológico do grupo.

```text
Cadastro / Login (Sessão Cookie) → Meus Grupos → Painel do Grupo
                                                    ├── Aba Despesas (IGUAL | POR_PESO | VALORES_FIXOS + Estorno)
                                                    ├── Aba Resumo (Saldos por Membro + Quitação Sugerida)
                                                    ├── Aba Extrato (Auditoria Cronológica + Pagamentos + Estorno)
                                                    └── Gerenciamento de Membros (Adicionar | Remover | Sair)
```

**Exemplo:** Ana paga R$ 90,00 de um jantar dividido igualmente com Bruno e Carla.

| Membro | Pagou | Parcela | Saldo exibido na UI |
|---|---:|---:|---|
| Ana | R$ 90,00 | R$ 30,00 | `A receber: R$ 60,00` |
| Bruno | R$ 0,00 | R$ 30,00 | `Deve: R$ 30,00` |
| Carla | R$ 0,00 | R$ 30,00 | `Deve: R$ 30,00` |

Na aba **Resumo**, o plano de quitação sugere duas transferências: Bruno → Ana (`R$ 30,00`) e Carla → Ana (`R$ 30,00`), com atalho direto para registrar o pagamento.

**Estado atual:** aplicação 100% funcional, integrada à API REST do backend, com proteção de rotas via middleware (`proxy.ts`), suíte de testes unitários automatizados cobrindo **100% das funções (`98,03%` das linhas)** da camada de serviços e deploy contínuo na **Vercel** orquestrado via **Jenkins** (`https://projeto-rateio-frontend.vercel.app`).

## Requisitos funcionais

**Situação:** ✅ implementado no código · 🟡 parcial · ⬜ pendente

| ID | Requisito | Regras principais | Situação | Módulos / Componentes |
|---|---|---|---|---|
| RF01 | Cadastrar e autenticar membros | Valida nome obrigatório, formato de e-mail, senha com no mínimo 8 caracteres e confirmação idêntica. Persiste sessão em cookie (`rateio_membro`). | ✅ | `validarAuth.ts`, `authService.ts`, `sessao.ts`, `RegisterForm.tsx`, `LoginForm.tsx` |
| RF02 | Proteger rotas autenticadas | Redireciona usuários não autenticados de `/grupos*` para `/login` e usuários já autenticados de `/login` ou `/cadastro` para `/grupos`. | ✅ | `proxy.ts`, `sessao.ts` |
| RF03 | Criar e listar grupos | Exige nome do grupo e ao menos 1 e-mail convidado válido, sem duplicatas e sem repetir o próprio e-mail do criador. | ✅ | `validarGrupo.ts`, `grupoService.ts`, `GroupCreateForm.tsx`, `grupos/page.tsx` |
| RF04 | Gerenciar membros do grupo | Permite adicionar novos membros por e-mail e remover membros (respeitando o mínimo de 2 membros no grupo e bloqueando remoção quando há despesas). | ✅ | `validarGrupo.ts`, `grupoService.ts`, `MemberManager.tsx` |
| RF05 | Registrar e listar despesas | Exige descrição, valor positivo (máximo de 2 casas decimais), pagador pertencente ao grupo e ao menos 1 participante sem repetição. | ✅ | `validarDespesa.ts`, `despesaService.ts`, `ExpenseForm.tsx`, `ExpenseList.tsx` |
| RF06 | Dividir despesas (`IGUAL`, `POR_PESO`, `VALORES_FIXOS`) | Valida pesos estritamente positivos na estratégia `POR_PESO` e garante que a soma em centavos das parcelas feche exatamente com o total em `VALORES_FIXOS`. | ✅ | `validarDespesa.ts`, `SplitStrategyInputs.tsx` |
| RF07 | Consultar saldos e plano de quitação | Exibe o saldo de cada membro (`A receber`, `Deve` ou `Quitado`) e lista as transferências mínimas sugeridas para zerar as dívidas do grupo. | ✅ | `saldoService.ts`, `formatarMoeda.ts`, `SummaryTab.tsx` |
| RF08 | Registrar pagamentos entre membros | Impede pagamento para si mesmo, exige valor positivo com até 2 casas decimais e rejeita valor superior à dívida sugerida entre a dupla. | ✅ | `validarPagamento.ts`, `pagamentoService.ts`, `PaymentForm.tsx` |
| RF09 | Estornar despesas e pagamentos | Permite estornar lançamentos ativos diretamente pela listagem de despesas ou pelo extrato, preservando o registro histórico como `ESTORNADA` / `ESTORNADO`. | ✅ | `despesaService.ts`, `pagamentoService.ts`, `ExpenseList.tsx`, `ExtractTab.tsx` |
| RF10 | Consultar extrato cronológico auditável | Consolida todas as despesas e pagamentos do grupo (ativos e estornados) em ordem cronológica e permite filtrar por status. | ✅ | `pagamentoService.ts`, `ExtractTab.tsx` |

## Requisitos não funcionais

| ID | Categoria | Requisito | Situação |
|---|---|---|---|
| RNF01 | Plataforma | O frontend deve utilizar Next.js 16 (App Router), React 19, TypeScript 5 (`strict: true`) e Tailwind CSS 4. | ✅ |
| RNF02 | Precisão monetária | Validações financeiras no cliente devem converter valores para centavos inteiros (`Math.round(valor * 100)`), evitando erros de ponto flutuante IEEE 754, e formatar valores no padrão `pt-BR` (`BRL`). | ✅ |
| RNF03 | Resiliência e UX | Mensagens de erro do backend devem ser traduzidas centralmente para português acentuado (`http.ts`), incluindo tratamento amigável de queda de conexão (`ApiError`). | ✅ |
| RNF04 | Segurança e configuração | A URL da API (`NEXT_PUBLIC_API_URL`) e credenciais de deploy (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) devem ser injetadas por variáveis de ambiente e cofre do Jenkins, nunca versionadas no código. | ✅ |
| RNF05 | Testabilidade | As regras de validação, sessão, formatação e integração HTTP devem ser desacopladas em `src/services/`, permitindo execução de testes unitários isolados em menos de 1 segundo sem depender de servidor ou navegador. | ✅ |
| RNF06 | CI/CD (Jenkins + Vercel) | O pipeline no `Jenkinsfile` deve instalar dependências (`npm ci`), rodar testes com cobertura (`npm run test:ci`), publicar relatórios JUnit e HTML, executar `npm run build` e realizar deploy automático em produção na **Vercel** exclusivamente na branch `main`. | ✅ |
| RNF07 | Manutenibilidade | O código deve seguir separação entre serviços de domínio (`src/services/`) e componentes de interface (`src/app/`), com histórico Git estruturado em branches temáticas, Pull Requests revisados e Conventional Commits. | ✅ |

## Histórias de usuário e rastreabilidade

| ID | História de Usuário (`Como... Quero... Para...`) | Critérios de Aceitação (`Given / When / Then`) | Prioridade | Status | Rastreabilidade (PRs → Testes Automatizados) |
|---|---|---|---|---|---|
| **US01** | **Como** visitante, **eu quero** criar uma conta e fazer login com e-mail e senha **para que** eu possa acessar meus grupos de rateio com sessão identificada. | **Given** que estou na tela de cadastro ou login<br>**When** informo dados válidos (senha ≥ 8 caracteres) ou inválidos/duplicados (HTTP 409/401)<br>**Then** o sistema valida os campos antes do envio, grava o cookie `rateio_membro` no login e redireciona para `/grupos`. | Alta | ✅ Entregue | PRs `#13`, `#15`, `#16` → `validarAuth.test.ts` (7 testes), `authService.test.ts` (7 testes), `sessao.test.ts` (7 testes) |
| **US02** | **Como** membro autenticado, **eu quero** criar grupos informando o nome e os e-mails dos participantes **para que** possamos compartilhar despesas comuns. | **Given** que estou autenticado em `/grupos/novo`<br>**When** informo o nome do grupo e e-mails de membros convidados<br>**Then** o sistema rejeita e-mails inválidos, repetidos ou o próprio e-mail do criador e envia `POST /grupos?membroId=`. | Alta | ✅ Entregue | PRs `#18`, `#22` → `validarGrupo.test.ts` (6 testes de criação), `grupoService.test.ts` (3 testes) |
| **US03** | **Como** membro de um grupo, **eu quero** adicionar novos integrantes ou remover membros sem pendências **para que** a composição do grupo reflita os participantes reais. | **Given** um grupo existente no painel<br>**When** adiciono um e-mail ou tento remover um membro<br>**Then** o sistema bloqueia duplicados (HTTP 409), exige mínimo de 2 membros no grupo e impede remoção caso o grupo já possua despesas. | Média | ✅ Entregue | PRs `#18`, `#28` → `validarGrupo.test.ts` (6 testes de membros), `grupoService.test.ts` (3 testes) |
| **US04** | **Como** membro do grupo, **eu quero** registrar despesas divididas igualmente, por peso ou por valores fixos e poder estorná-las **para que** todos os gastos fiquem registrados com precisão de centavos. | **Given** um grupo ativo<br>**When** registro uma despesa (`IGUAL`, `POR_PESO` ou `VALORES_FIXOS`) ou solicito seu estorno<br>**Then** o sistema valida pesos > 0, exige que a soma das parcelas fixas em centavos bata com o total e permite estorno lógico (`POST .../estorno`). | Alta | ✅ Entregue | PRs `#19`, `#20`, `#24` → `validarDespesa.test.ts` (7 testes), `despesaService.test.ts` (5 testes) |
| **US05** | **Como** membro do grupo, **eu quero** visualizar o saldo consolidado de cada integrante e o plano sugerido de transferências **para que** saibamos a forma mais simples de quitar as dívidas. | **Given** um grupo com despesas e pagamentos registrados<br>**When** acesso a aba `Resumo`<br>**Then** o sistema exibe os saldos formatados (`A receber`, `Deve` ou `Quitado`) e a lista mínima de transferências sugeridas (`GET /saldos` e `GET /quitacao`). | Alta | ✅ Entregue | PRs `#21`, `#26` → `saldoService.test.ts` (4 testes), `formatarMoeda.test.ts` (6 testes) |
| **US06** | **Como** membro devedor, **eu quero** registrar pagamentos para credores, estornar pagamentos incorretos e consultar o extrato cronológico **para que** o histórico financeiro do grupo seja auditável. | **Given** uma dívida sugerida no grupo<br>**When** registro um pagamento ou consulto a aba `Extrato`<br>**Then** o sistema impede pagar a si mesmo ou valor acima da dívida, permite estorno lógico e lista despesas e pagamentos em ordem cronológica. | Média | ✅ Entregue | PRs `#23`, `#25`, `#27` → `validarPagamento.test.ts` (3 testes), `pagamentoService.test.ts` (5 testes) |

## Metodologia e dinâmica de desenvolvimento

### Metodologia adotada (Scrum + Práticas de XP)
O grupo adotou uma abordagem ágil híbrida combinando **Scrum** (gestão visual de backlog no **Jira**, histórias de usuário com critérios de aceite e entregas incrementais alinhadas aos marcos da disciplina) e práticas técnicas de **Extreme Programming (XP)** e **GitHub Flow**:
- **Papéis e responsabilidades no grupo**:
  - **Desenvolvimento Frontend e Arquitetura de Serviços/UI**: Paulo Henrique Martins e Cauã — implementação das telas em Next.js App Router, componentes de grupos/despesas/resumo/extrato, validações de domínio e integração HTTP.
  - **Qualidade de Software (QA), Testes e Documentação**: André, Gustavo Ferreira Vieira e Paulo Henrique Martins — construção das suítes de testes unitários com Vitest (`vi.fn()`), relatórios de cobertura V8/JUnit e documentação de engenharia de requisitos.
  - **DevOps / CI/CD e Integração Full-Stack**: Luiz Gabriel, Paulo Henrique Martins e equipe — configuração do pipeline no **Jenkins** (`Jenkinsfile`), integração com **Vercel CLI** para deploy contínuo e alinhamento de contratos com o backend Spring Boot.
- **Definition of Ready (DoR)**: História escrita no formato padrão com critérios de aceite definidos e contrato da rota HTTP (`Contratos_API.txt`) acordado com o time de backend.
- **Definition of Done (DoD)**: Funcionalidade implementada em branch dedicada (`feat/...`, `fix/...`, `refactor/...`, `test/...`, `chore/...`), coberta por testes unitários passando no Vitest (`npm run test:ci`), sem erros de lint/compilação (`npm run build`), revisada via Pull Request e integrada à `main` com deploy automático na Vercel.

### Dinâmica de desenvolvimento e lições aprendidas
- **O que funcionou bem**: A decisão arquitetural de isolar toda a regra de validação, formatação monetária e comunicação HTTP na pasta `src/services/` (separada dos componentes React `.tsx`) permitiu desenvolver e testar 100% das regras de negócio com testes unitários rápidos (~180ms) usando mocks (`vi.fn()`) mesmo antes de todas as telas estarem finalizadas.
- **Bloqueios e como o grupo resolveu**:
  1. *Incompatibilidade ESM no Node 20 do container Linux do Jenkins*: o estágio de testes quebrava ao carregar `vitest.config.ts` por diferença de versão do Node 20 entre Windows e o container do Jenkins. Resolvido no PR `#31` (`ad70ba5`) convertendo o arquivo para `vitest.config.mts`.
  2. *Escopo de cobertura distorcido por arquivos visuais*: inicialmente o relatório do Vitest incluía páginas estáticas `.tsx`, diluindo a métrica global. Ajustado no `vitest.config.mts` para medir `src/**/*.ts`, revelando a cobertura real de **98,03%** nos serviços.
- **Lições aprendidas**: Formalizar o contrato da API (`Contratos_API.txt`) logo no início da sprint eliminou retrabalho na integração entre o frontend Next.js e o backend Spring Boot, e manter commits atômicos facilitou rastrear e reverter alterações pontuais durante a reta final.

## Refactorings aplicados

Seguindo o catálogo de **Refactoring** de Martin Fowler e os conceitos da disciplina C14 (eliminação de *Code Smells* apoiada por testes de regressão), os seguintes refactorings foram realizados e documentados no histórico do repositório:

| Técnica de Refactoring | *Code Smell* / Motivação | O que foi feito | Evidência (Commits / PRs) |
|---|---|---|---|
| **Extract & Move Method** *(Extração e Movimentação de Método)* | **Código Duplicado**: As funções `emCentavos` e `temNoMaximoDuasCasas` e a interface `ValidacaoResultado` estavam duplicadas entre `validarDespesa.ts` e `validarPagamento.ts`. | Funções extraídas e movidas para o módulo coeso `src/services/formatarMoeda.ts` e reutilizadas via `import` nos validadores. | Commit `2122396` (PR `#36`) |
| **Rename Method** *(Renomeação)* | **Inconsistência Léxica**: A função `ValidarPagamento` utilizava `PascalCase`, divergindo do padrão `camelCase` dos demais validadores (`validarDespesa`, `validarCadastro`). | Função renomeada para `validarPagamento` e referências atualizadas em `validarPagamento.test.ts` e `PaymentForm.tsx`. | Commit `9261d84` (PR `#36`) |
| **Extract Method / Unificação Arquitetural** | **Duplicação de Cliente HTTP**: `authService.ts` realizava chamadas `fetch` e leitura de erro manualmente em vez de usar o cliente central `requisicao<T>()` de `http.ts`. | `authService.ts` refatorado (reduzido de 60 para 33 linhas) passando a delegar para `requisicao<T>()` em `http.ts`, unificando o tratamento de erros e queda de conexão. | Commit `da7dfd0` (PR `#36`) |
| **Move Component / Modularização de Diretórios** | **Organização de Componentes de Grupo**: Componentes de abas do grupo estavam misturados na raiz da rota. | Componentes movidos e agrupados por subdomínio em `src/app/grupos/_components/` (`despesas/`, `resumo/`, `extrato/`, `membros/`, `pagamentos/`). | Commit `d59a33f` (PR `#24`) |
| **Remoção de Código Morto e Débito Técnico** | **Arquivos Legados e Dependências Fantasmas**: Protótipos `.html` antigos, rascunho `rateio.js` e pacotes não utilizados (`better-auth`, `react-hook-form`, `zod`) inflamavam o build. | Exclusão dos arquivos legados e remoção das dependências não utilizadas do `package.json`. | Commits `284b969`..`411c621` (PR `#33`) e `f47994b` (PR `#36`) |

## Como testar

**Pré-requisitos:** Node.js 20 ou superior e `npm`. Os testes são unitários e utilizam mocks (`vi.fn()`) para isolar chamadas HTTP (`fetch`), portanto **não precisam do backend em execução** nem de banco de dados.

```bash
# Instalar dependências (reproduzível via package-lock.json)
npm ci

# Executar todos os testes unitários
npm test -- --run

# Executar uma suíte específica
npx vitest run src/services/__tests__/despesaService.test.ts

# Executar testes com relatório de cobertura V8 e JUnit XML (mesmo comando do Jenkins)
npm run test:ci
```

Os relatórios são gerados em `reports/junit.xml` (JUnit) e `coverage/index.html` (Cobertura V8).

| Suíte de teste (`src/services/__tests__/`) | Tipo | Testes | Cobertura do Módulo (`% Funcs` / `% Lines`) |
|---|---|---:|---:|
| `validarGrupo.test.ts` | Unidade pura (sem mock) | 12 | 100% / 100% |
| `validarAuth.test.ts` | Unidade pura (sem mock) | 7 | 100% / 100% |
| `validarDespesa.test.ts` | Unidade pura (sem mock) | 7 | 100% / 93,61% |
| `sessao.test.ts` | Unidade pura + stub de DOM | 7 | 100% / 100% |
| `authService.test.ts` | Unidade com Mock (`fetch`) | 7 | 100% / 100% |
| `grupoService.test.ts` | Unidade com Mock (`fetch`) | 6 | 100% / 100% |
| `formatarMoeda.test.ts` | Unidade pura + *Exceptional Limit* | 3 | 100% / 100% |
| `http.test.ts` | Unidade com Mock (`fetch`) | 5 | 100% / 96,72% |
| `despesaService.test.ts` | Unidade com Mock (`fetch`) | 5 | 100% / 100% |
| `pagamentoService.test.ts` | Unidade com Mock (`fetch`) | 5 | 100% / 100% |
| `saldoService.test.ts` | Unidade com Mock (`fetch`) | 4 | 100% / 100% |
| `validarPagamento.test.ts` | Unidade pura (sem mock) | 3 | 100% / 91,42% |
| **Total (12 suítes)** | **Puros + Mocks (FIRST)** | **74** | **100% Funcs / 98,03% Lines** |

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz do projeto apontando para a URL do backend:

   | Variável | Obrigatória | Exemplo (Local / Produção) |
   |---|---|---|
   | `NEXT_PUBLIC_API_URL` | Sim | `http://localhost:8080` |

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. Inicie o servidor de desenvolvimento ou gere o build de produção:

   ```bash
   # Modo desenvolvimento (http://localhost:3000)
   npm run dev

   # Build otimizado de produção e inicialização
   npm run build
   npm start
   ```

## Tecnologias e ferramentas

| Categoria | Tecnologia |
|---|---|
| Linguagem | TypeScript 5 |
| Framework Web | Next.js 16.3.4 (App Router & Turbopack) + React 19 |
| Estilização e UI | Tailwind CSS 4 e Sonner (notificações toast) |
| Gerenciador de Pacotes | npm (`package-lock.json` versionado) |
| Testes e Cobertura | Vitest 3.2, `@vitest/coverage-v8` e Testing Library |
| Qualidade de Código | ESLint 9 (`eslint-config-next`) |
| CI/CD e Hospedagem | Jenkins (`Jenkinsfile`) + Vercel (`Vercel CLI`) |
| Gestão Ágil e Versionamento | Jira, Git e GitHub |
| IDE | Visual Studio Code |

## Uso de IA

A Inteligência Artificial foi utilizada de forma transparente como ferramenta de apoio em planejamento arquitetural, elaboração de casos de teste unitários, configuração de CI/CD, revisão de código (*refactoring*) e estruturação documental.

| Ferramenta | Finalidade | Dinâmica de Uso |
|---|---|---|
| Assistentes de IA (Claude / Gemini / ChatGPT) | Planejamento de integração com contratos da API, geração de cenários de teste no Vitest, configuração do estágio de deploy na Vercel no `Jenkinsfile`, identificação de *Code Smells* e documentação | Utilizada em formato de *pair programming* e consultoria técnica: a IA propunha planos, explicações e trechos de código, enquanto os integrantes escreviam, adaptavam, validavam localmente (`npm test` / `npm run build`) e realizavam os commits e revisões de Pull Request manualmente. |

### Paulo Henrique Martins

> **Escopo deste registro:** os itens abaixo referem-se às entregas realizadas por **Paulo Henrique Martins** neste repositório.

| Ferramenta | Modelo | Finalidade |
|---|---|---|
| Google Antigravity (IDE) | Claude Opus 4.6 / Gemini | Arquitetura de rotas, *User Stories*, geração de `sessao.test.ts`, adaptação de `ExpenseForm` e `SplitStrategyInputs`, deploy no Jenkins/Vercel, auditoria de testes, *refactoring*, textos de PRs e este `README.md` |

### O que foi desenvolvido à mão e validado pelo grupo
- Modelagem das telas e fluxo de navegação entre Grupos, Despesas, Resumo de Saldos, Pagamentos e Extrato.
- Adaptação fina dos contratos de requisição/resposta (`?membroId=` na query string e tratamento de erros `{ "mensagem": "..." }`) de acordo com o backend real do grupo.
- Configuração do servidor Jenkins, criação e gerenciamento de credenciais seguras (`vercel-token`, `vercel-org-id`, `vercel-project-id`), resolução de conflitos de merge e revisão de Pull Requests no GitHub.
- Execução manual de todos os comandos de verificação, criação de branches e organização de commits atômicos seguindo o padrão *Conventional Commits*.

### André

> **Escopo deste registro:** os prompts abaixo referem-se exclusivamente às entregas realizadas pelo integrante **André** neste repositório. O uso de IA pelos demais integrantes pode ser acrescentado em subseções próprias abaixo.

1. **Entrega 3 — Testes Unitários (Vitest, Mocks e Cenários Negativos)**
   > *"Com base nos arquivos do nosso front-end em Next.js/TypeScript e nos slides da disciplina de Engenharia de Software sobre testes de unidade, estou assumindo a parte de QA do grupo e preciso estruturar a nossa suíte de testes no Vitest. Dê uma analisada nos nossos arquivos de serviço (grupoService, despesaService, pagamentoService, saldoService e authService) e me ajude a criar pelo menos 4 testes unitários bem isolados: quero 2 testes puros (sem mock) focados em regras de validação e formatação, e 2 testes utilizando mocks (vi.fn() / mock do cliente HTTP) para simular o comportamento da API sem depender do back-end no ar — incluindo obrigatoriamente casos de teste negativos para garantir que o front-end trata bem falhas de requisição e entradas inválidas. Além do mínimo pedido na tarefa, aponte se existe algum caso de borda importante que estamos deixando passar nos serviços. Por fim, me ajude a organizar o commit dentro das boas práticas (test(frontend): ...)."*

2. **Entrega 4 — Pipeline de CI/CD (Jenkins, Relatórios JUnit e Cobertura)**
   > *"Considerando o nosso projeto front-end em Next.js/TypeScript com a suíte do Vitest já rodando e os conceitos de Integração Contínua vistos nos slides de Engenharia de Software, preciso montar a minha parte do pipeline de CI/CD no Jenkins (já que não podemos usar GitHub Actions na disciplina). Como sou o responsável pelos testes do front-end, me ajude a configurar o Vitest no package.json e no vitest.config para gerar um relatório de execução em formato JUnit XML e um relatório de cobertura de código (coverage) que o Jenkins consiga ler e exibir visualmente após cada build. Também preciso estruturar o stage/job de Testes no Jenkinsfile garantindo que o pipeline quebre automaticamente caso algum teste unitário falhe, além de validar se há alguma melhoria extra que podemos colocar na etapa de verificação antes de subir o commit seguindo o padrão Conventional Commits."*

3. **Entrega 5 — Agile e Engenharia de Requisitos (Jira, User Stories e README)**
   > *"Com base no escopo do nosso sistema de rateio de despesas e nos materiais da disciplina sobre Metodologias Ágeis e Engenharia de Requisitos, preciso organizar a minha contribuição para o backlog do projeto no Jira (Scrum) e na documentação do repositório. Me ajude a redigir uma User Story completa voltada para a experiência e confiabilidade do usuário no front-end, seguindo o padrão 'Como [persona], quero [ação], para [benefício]', acompanhada de critérios de aceite bem objetivos (no formato Dado/Quando/Então) que facilitem a validação nos nossos testes. Depois disso, me ajude a revisar e estruturar a documentação no README.md separando claramente a descrição da aplicação, os Requisitos Funcionais (RF) e os Requisitos Não Funcionais (RNF) — incluindo metas de qualidade, cobertura de testes e desempenho — para fechar a entrega com tudo bem alinhado entre o código e a gestão ágil."*

4. **Última Entrega — Revisão de Exceções e Refatoração**
   > *"Com base nos arquivos do nosso projeto em Next.js/TypeScript e nos slides da disciplina de Engenharia de Software que te enviei, dê uma analisada na nossa suíte de testes unitários no Vitest (principalmente nos serviços e no cliente HTTP) para me ajudar a confirmar se os cenários de exceção e erros de requisição estão bem cobertos. Além do que foi pedido na tarefa, gostaria que você sugerisse pontos de melhoria ou verificações extras de exceptions no código para deixar a aplicação ainda mais segura contra falhas. Depois disso, me ajude a aplicar uma refatoração simples e de baixo risco — como extrair constantes no arquivo formatarMoeda.ts no lugar de deixar valores fixos — tomando cuidado para manter as funções formatarMoeda e descreverSaldo funcionando exatamente como antes. Por fim, me guie na validação rodando o ESLint e os testes para garantir que nada quebrou antes de eu subir o commit no padrão Conventional Commits e abrir o Pull Request."*

### Paulo Henrique Martins

> **Escopo deste registro:** os prompts abaixo referem-se às entregas e atividades realizadas pelo integrante **Paulo Henrique Martins** neste repositório.

1. **Concepção da Estrutura do Site e Arquitetura de Rotas (4.1, 4.2, 4.3 e 4.4)**
   > *"Atuando como um Desenvolvedor Front-End Sênior, ajude-me a planejar a arquitetura e a estrutura de rotas do nosso sistema de Rateio de Despesas em Next.js (App Router) e TypeScript. Precisamos estruturar um plano de ação detalhado para cobrir as entregas centrais do front-end: gerenciamento de grupos e membros (4.1), registro e listagem de despesas com estratégias de divisão igual, por peso e por valores fixos (4.2), visualização de saldos consolidados e plano de quitação sugerido (4.3), e registro de pagamentos com extrato cronológico e estornos (4.4), separando a camada de serviços e validações (`src/services/`) dos componentes visuais (`src/app/`)."*

2. **Criação das Histórias de Usuário (*User Stories*) para o Jira**
   > *"Ajude-me a criar e estruturar todas as Histórias de Usuário (User Stories) do front-end para o nosso quadro no Jira, seguindo o formato padrão 'Como <perfil>, eu quero <ação> para que <benefício>', acompanhadas de critérios de aceitação claros no padrão Given/When/Then, definição de prioridade e rastreabilidade com os módulos de autenticação, grupos, despesas, saldos/quitação, pagamentos e extrato."*

3. **Planejamento do Fluxo de Autenticação e Geração dos Testes de Sessão (`sessao.test.ts`)**
   > *"Estruture um plano de execução para implementarmos o fluxo de autenticação (`/login` e `/cadastro`) e o gerenciamento de sessão via cookies (`sessao.ts`). Além disso, gere o código do arquivo de testes `sessao.test.ts` com base no comportamento esperado das funções de sessão (serialização e leitura do cookie `rateio_membro`, múltiplos cookies, cookie ausente, JSON corrompido e cookie sem ID)."*
   - **Resultado:** O código gerado pela IA para `sessao.test.ts` foi copiado para o projeto antes da criação do arquivo `sessao.ts`. Posteriormente, ao incluir os testes de manipulação do `document.cookie`, a linha `delete globalThis.document` foi ajustada para `Reflect.deleteProperty(globalThis, "document")` para corrigir o erro de tipagem no build.

4. **Alinhamento com os Contratos da API (`Contratos_API.txt`) e Adaptação de `ExpenseForm` e `SplitStrategyInputs`**
   > *"Com base no arquivo de especificação de rotas do nosso backend (`Contratos_API.txt`), analise a estrutura atual do nosso front-end para alinharmos a integração de ponta a ponta (Autenticação, Sessão, Cliente HTTP centralizado, Grupos, Despesas, Saldos/Quitação, Pagamentos e Extrato). Como refatoramos as assinaturas e tipos de `despesaService.ts` e `validarDespesa.ts` para refletir o contrato real das estratégias de divisão (`IGUAL`, `POR_PESO` e `VALORES_FIXOS`), atualize os componentes `ExpenseForm.tsx` e `SplitStrategyInputs.tsx` para que fiquem compatíveis com a nova estrutura."*
   - **Resultado:** O plano de alinhamento com os contratos reais do backend foi adotado e o código atualizado pela IA para os componentes `ExpenseForm.tsx` e `SplitStrategyInputs.tsx` foi integrado ao projeto após o refactoring dos serviços de despesa.

5. **Redação dos Textos de Todos os Pull Requests e Padronização de Branches/Commits**
   > *"Para cada funcionalidade, correção, limpeza e refatoração implementada no front-end, sugira o nome padronizado da branch (`feat/...`, `fix/...`, `refactor/...`, `test/...`, `chore/...`, `ci/...`), a organização das mensagens de commit atômicas seguindo o padrão Conventional Commits e redija o texto completo da descrição do Pull Request no GitHub contendo Objetivo, Alterações Realizadas e Como Testar/Validar."*

6. **Correção de Erros de Português, Melhoria de Textos e Verificação das Boas Práticas em Todas as Branches**
   > *"Em todas as branches desenvolvidas, revise e corrija eventuais erros de português e acentuação nas mensagens de validação e de erro exibidas ao usuário, aprimore a escrita técnica dos textos da aplicação e confirme se todas as boas práticas de Engenharia de Software vistas na disciplina estão sendo respeitadas antes do merge na branch `main`."*

7. **Planejamento de Deploy Contínuo (CD) na Vercel Orquestrado pelo `Jenkinsfile`**
   > *"Considerando o feedback da Entrega 4 de CI/CD e os requisitos da NP2 para publicar a aplicação fora da máquina local do Jenkins, estruture um plano de execução para automatizar o deploy de produção do nosso front-end na Vercel diretamente pelo `Jenkinsfile`. O estágio de deploy deve ser executado exclusivamente na branch `main` e somente após a aprovação integral nos estágios anteriores de instalação (`npm ci`), testes unitários com cobertura (`npm run test:ci`) e compilação (`npm run build`), utilizando credenciais seguras no cofre do Jenkins."*

8. **Diagnóstico do Ambiente de CI (Node 20 / ESM) e Escopo de Cobertura no Vitest**
   > *"Analise a falha reportada pelo container Linux do Jenkins ao carregar o arquivo `vitest.config.ts` durante o estágio `Testes e Cobertura - Front-End` e indique a causa técnica da incompatibilidade entre o módulo ESM do Vitest e o ambiente Node 20 do pipeline. Além disso, oriente como configurar corretamente as propriedades `include` e `exclude` de cobertura para que o relatório V8/JUnit avalie de forma precisa a camada de regras de negócio e serviços (`src/services/*.ts`), sem distorcer as métricas com arquivos puramente visuais (`.tsx`)."*

9. **Auditoria da Suíte de Testes Unitários frente ao Material de Engenharia de Software (Aulas 05 a 08)**
   > *"De acordo com os slides das Aulas 05 a 08 da disciplina C14 (Teste de Software, Teste de Unidade, Princípios FIRST, Teste Mock e os 4 Padrões para Criação de Testes: API Definition, Differential Test, Exceptional Limit e Everything Working Together), realize uma auditoria completa em todas as nossas suítes de testes unitários em `src/services/__tests__/`. Aponte se há funções sem cobertura direta, onde podemos reforçar cenários de limite excepcional (`Exceptional Limit`) e onde aplicar Injeção de Dependência por parâmetro para isolar chamadas externas com Mocks."*

10. **Revisão Crítica de *Code Smells*, Refactoring e Pagamento de Débito Técnico**
    > *"Atuando como um Desenvolvedor Sênior e utilizando como referência os conceitos da aula de Refactoring e Débito Técnico de C14 (Leis de Lehman, Catálogo de Refactorings de Martin Fowler e identificação de Code Smells), faça uma crítica técnica ao nosso código-fonte e monte um plano de ação indicando quais refatorações oportunas devemos aplicar — como eliminação de código duplicado por Extração/Movimentação de Método, padronização léxica por Renomeação (`camelCase`), unificação do cliente HTTP e remoção de dependências e arquivos legados não utilizados — garantindo que nenhuma alteração quebre a suíte de testes de regressão."*

11. **Resolução de Problemas no Git (Remoção do `.idea` do Histórico Remoto, Isolamento de PRs e `commit --amend`)**
    > *"O diretório `.idea` já foi comitado anteriormente na `main` do GitHub (conforme apontado no feedback do professor). Oriente como removê-lo apenas do índice remoto do Git (`git rm -r --cached .idea`) mantendo-o no `.gitignore`, explique a restrição do Git para nomes de branches contendo `/.idea`, mostre como isolar uma branch quando um Pull Request soma commits de uma branch anterior e como renomear a mensagem do último commit (`git commit --amend`)."*

12. **Estruturação e Redação deste `README.md`**
    > *"Elabore o arquivo `README.md` completo para o repositório de front-end (`INATEL_C14_PROJETO_FRONTEND`) seguindo o mesmo padrão estrutural do repositório de backend (`INATEL_C14_PROJETO_BACKEND`) e contemplando todos os requisitos obrigatórios do documento da NP2 de C14: descrição do fluxo da aplicação, tabelas de Requisitos Funcionais e Não Funcionais, Histórias de Usuário com critérios Given/When/Then e rastreabilidade com PRs e testes, metodologia e dinâmica de desenvolvimento, catálogo de Refactorings aplicados com evidências de commits, instruções de teste/execução e documentação transparente do Uso de IA."*