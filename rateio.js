/**
 * Divide um valor total entre N participantes e distribui os centavos de sobra deterministicamente.
 * @param {number} valorTotal - O valor total da despesa em reais.
 * @param {number} numPessoas - Quantidade de participantes.
 * @returns {number[]} Array contendo o valor exato a ser pago por cada pessoa.
 */
export function calcularDivisaoDespesa(valorTotal, numPessoas) {
    if (valorTotal <= 0) {
        throw new Error("O valor da despesa deve ser maior que zero.");
    }
    if (!Number.isInteger(numPessoas) || numPessoas < 1) {
        throw new Error("O número de pessoas deve ser um inteiro maior ou igual a 1.");
    }

    // Trabalha em centavos para evitar erros de precisão do JavaScript
    const totalCentavos = Math.round(valorTotal * 100);
    const baseCentavos = Math.floor(totalCentavos / numPessoas);
    let restoCentavos = totalCentavos % numPessoas;

    const resultado = [];
    for (let i = 0; i < numPessoas; i++) {
        let parcela = baseCentavos;
        if (restoCentavos > 0) {
            parcela += 1;
            restoCentavos--;
        }
        resultado.push(parcela / 100);
    }

    return resultado;
}