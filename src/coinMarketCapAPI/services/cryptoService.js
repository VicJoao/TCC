const axios = require('axios');

// Function to load environment variables
function loadEnv() {
    require('dotenv').config();
}

// Extract from .env file
function getApiKey() {
    loadEnv();
    return process.env.MARKET_CAP_API_KEY;
}

// Function to split an array into chunks
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

// Delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAllCryptocurrencySymbols() {
    const allSymbols = [];
    let startIndex = 1;
    const limit = 5000;
    const API_KEY = getApiKey();

    while (true) {
        try {
            const response = await axios.get(
                'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
                {
                    headers: {
                        'X-CMC_PRO_API_KEY': API_KEY,
                    },
                    params: {
                        limit: limit,
                        start: startIndex,
                    },
                }
            );

            if (response && response.data && response.data.data.length > 0) {
                const symbols = response.data.data.map(
                    (crypto) => crypto.symbol
                );
                allSymbols.push(...symbols);
                console.log('Fetched symbols:', symbols.length);
                startIndex += limit;
            } else {
                break;
            }
        } catch (error) {
            console.error('Error fetching cryptocurrency listings:', error);
            if (error.response && error.response.status === 429) {
                console.error(
                    'Rate limit exceeded. Waiting before retrying...'
                );
                await delay(10000);
            }
            break;
        }
    }

    console.log('Total cryptocurrency symbols:', allSymbols.length);
    console.log('Sample symbols:', allSymbols.slice(0, 5));
    return allSymbols;
}

// Function to fetch cryptocurrencies with repositories
async function fetchCryptocurrenciesWithRepositories(symbols) {
    const chunks = chunkArray(symbols, 100);
    const allCryptosWithRepos = [];
    const API_KEY = getApiKey();
    const maxRetries = 3;
    const delayDuration = 60000;

    for (const chunk of chunks) {
        console.log('Fetching metadata for:', chunk.join(','));
        let attempts = 0;

        while (attempts < maxRetries) {
            try {
                const response = await axios.get(
                    'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info',
                    {
                        headers: {
                            'X-CMC_PRO_API_KEY': API_KEY,
                        },
                        params: {
                            symbol: chunk.join(','),
                            aux: 'urls',
                        },
                    }
                );

                // Extract the name, symbol, and source_code from the response
                const cryptosInfo = Object.values(response.data.data).map(
                    (cryptoArray) => {
                        const crypto = cryptoArray[0];

                        const sourceCode = crypto.urls.source_code.filter(
                            (code) =>
                                code !== undefined &&
                                code !== null &&
                                code !== ''
                        );

                        return {
                            name: crypto.name,
                            symbol: crypto.symbol,
                            source_code: sourceCode,
                        };
                    }
                );

                allCryptosWithRepos.push(...cryptosInfo);
                break;
            } catch (error) {
                if (error.response) {
                    console.error('Status Code:', error.response.status);
                    if (error.response.status === 429) {
                        attempts++;
                        console.error(
                            `Rate limit exceeded. Attempt ${attempts} of ${maxRetries}. Waiting before retrying...`
                        );
                        await delay(delayDuration);
                        continue;
                    }
                }
                console.error('Error message:', error.message);
                break;
            }
        }
    }
    console.log(
        'Total cryptocurrencies with repositories:',
        allCryptosWithRepos.length
    );
    return allCryptosWithRepos;
}

module.exports = {
    fetchAllCryptocurrencySymbols,
    fetchCryptocurrenciesWithRepositories,
};
