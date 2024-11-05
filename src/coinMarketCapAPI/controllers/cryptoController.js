const cryptoService = require('../services/cryptoService');
const escapeHtml = require('escape-html'); // Importing escape-html

async function getCryptosWithRepositories(req, res) {
    try {
        const symbols = await cryptoService.fetchAllCryptocurrencySymbols();

        if (symbols.length > 0) {
            const cryptosWithRepos =
                await cryptoService.fetchCryptocurrenciesWithRepositories(
                    symbols
                );

            const responseHtml = `
                <div class="container">
                    <h1 class="mt-4 mb-4">Total cryptocurrencies with repositories: ${
                        cryptosWithRepos.length
                    }</h1>
                    <ul class="list-group">
                        ${cryptosWithRepos
                            .map((crypto) => {
                                if (crypto.source_code <= 0) {
                                    return;
                                }
                                const name = escapeHtml(crypto.name);
                                const symbol = escapeHtml(crypto.symbol);
                                const sourceCode = escapeHtml(
                                    crypto.source_code[0]
                                );
                                return `
                                    <li class="list-group-item">
                                        <strong>${name} (${symbol})</strong>: <a href="${sourceCode}" target="_blank">${sourceCode}</a>
                                    </li>
                                `;
                            })
                            .join('')}
                    </ul>
                </div>
            `;
            res.send(responseHtml);
        } else {
            res.send('<h1>No cryptocurrencies found.</h1>');
        }
    } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
        res.status(500).send('An error occurred while fetching data.');
    }
}

module.exports = {
    getCryptosWithRepositories,
};
