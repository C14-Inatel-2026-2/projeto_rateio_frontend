#  Sistema de Rateio de Despesas de Grupo (Front-End)

Aplicação web desenvolvida em Next.js e TypeScript projetada para facilitar o gerenciamento, divisão e prestação de contas de despesas compartilhadas entre membros de grupos.

---

##  Descrição do Projeto

O **Sistema de Rateio de Despesas** permite que usuários criem grupos, adicionem integrantes, registrem gastos efetuados e obtenham o cálculo automático de divisão de custos. A aplicação conta com validações em tempo de execução e possui uma suíte de testes unitários integrada ao pipeline de integração contínua (CI/CD via Jenkins).

---

##  Requisitos do Sistema

###  Requisitos Funcionais (RF)
* **RF01 - Gerenciamento de Grupos:** O sistema deve permitir a criação, visualização e listagem de grupos de despesas.
* **RF02 - Cadastro de Integrantes:** O sistema deve permitir adicionar e gerenciar membros participantes de um grupo.
* **RF03 - Registro de Despesas:** O sistema deve permitir o cadastro de novas despesas associadas a um grupo especificando o pagador, valor e descrição.
* **RF04 - Cálculo de Rateio e Saldo:** O sistema deve calcular automaticamente o valor devido ou a receber por cada integrante com base no total de gastos acumulados.
* **RF05 - Validação de Dados:** O sistema deve validar a integridade dos dados inseridos (valores numéricos positivos, descrições obrigatórias) antes do processamento.

###  Requisitos Não Funcionais (RNF)
* **RNF01 - Usabilidade & Interface:** Interface amigável, responsiva e dinâmica construída com Next.js, React 19 e Tailwind CSS.
* **RNF02 - Qualidade de Código & Cobertura:** A camada de serviços de negócios e utilitários deve manter elevada cobertura de testes unitários automatizados via Vitest.
* **RNF03 - Automação CI/CD:** O projeto deve conter integração contínua configurada no Jenkins via `Jenkinsfile` para execução autônoma de suítes de testes e geração de relatórios visuais de cobertura (`coverage/index.html`).
* **RNF04 - Manutenibilidade:** Código estruturado sob forte tipagem com TypeScript, seguindo padrões de linting com ESLint e commits semânticos (Conventional Commits).

---

##  Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (versão 18 ou superior)
* npm

### Passos
1. **Clonar o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd projeto_rateio_frontend-main
