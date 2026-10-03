export class SaldoService {
    constructor(apiBaseUrl = 'https://api.exemplo.com') {
        this.apiBaseUrl = apiBaseUrl;
    }

    // Método sem mock: Calcula quem deve quanto com base nas despesas
    calcularSaldoIndividual(valorTotal, participantes) {
        if (!valorTotal || valorTotal <= 0) {
            throw new Error("O valor total deve ser maior que zero.");
        }
        if (!participantes || !Array.isArray(participantes) || participantes.length === 0) {
            throw new Error("A lista de participantes não pode ser vazia.");
        }

        const valorPorPessoa = Math.round((valorTotal / participantes.length) * 100) / 100;
        return participantes.map(p => ({
            nome: p,
            devendo: valorPorPessoa
        }));
    }

    // Método com mock: Busca os saldos consolidados do servidor
    async buscarSaldosDoGrupo(grupoId) {
        if (!grupoId) {
            throw new Error("ID do grupo é obrigatório.");
        }

        const response = await fetch(`${this.apiBaseUrl}/grupos/${grupoId}/saldos`);

        if (!response.ok) {
            throw new Error("Erro ao buscar saldos do servidor.");
        }

        return await response.json();
    }
}