// CoinGecko API Integration for Crypto Dashboard
// Free tier: 10-30 calls/minute, 50 calls/minute for pro

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 300000; // 5 minutes in milliseconds
let lastFetchTime = 0;
let cachedData = null;

// Top cryptocurrencies to display (by market cap)
const TOP_CRYPTOS = [
    'bitcoin',
    'ethereum', 
    'binancecoin',
    'solana',
    'ripple',
    'cardano',
    'dogecoin',
    'polkadot',
    'chainlink',
    'litecoin'
];

// Exchange data (static for now, could be API later)
const EXCHANGES = [
    {
        id: 'binance',
        name: 'Binance',
        logo: 'B',
        fees: '0.1%',
        coins: '350+',
        volume: '$18.2B',
        trust: '9.8/10',
        affiliateUrl: 'https://www.binance.com/en/register?ref=ABC123',
        offer: 'Get 10% Fee Discount'
    },
    {
        id: 'coinbase',
        name: 'Coinbase',
        logo: 'C',
        fees: '0.5%',
        coins: '200+',
        volume: '$2.1B',
        trust: '9.5/10',
        affiliateUrl: 'https://www.coinbase.com/join/XYZ456',
        offer: 'Get $10 Free Bitcoin'
    },
    {
        id: 'kraken',
        name: 'Kraken',
        logo: 'K',
        fees: '0.16%',
        coins: '185+',
        volume: '$1.8B',
        trust: '9.3/10',
        affiliateUrl: 'https://www.kraken.com/sign-up?ref=DEF789',
        offer: 'Low Fees & Advanced Trading'
    }
];

// Fetch data from CoinGecko API
async function fetchCryptoData() {
    const now = Date.now();
    
    // Use cache if available and not expired
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
        console.log('Using cached data');
        return cachedData;
    }
    
    try {
        console.log('Fetching fresh data from CoinGecko...');
        
        // For demo purposes, we'll use simulated data
        // In production, uncomment the fetch code below
        
        /*
        const response = await fetch(
            `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${TOP_CRYPTOS.join(',')}&order=market_cap_desc&per_page=10&sparkline=false`
        );
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        */
        
        // Simulated data for demo
        const simulatedData = TOP_CRYPTOS.map((id, index) => {
            const basePrice = [68423, 3812, 580, 102, 1.23, 0.45, 0.15, 6.8, 14.2, 82.5][index] || 100;
            const change = (Math.random() * 10 - 5).toFixed(2);
            const price = basePrice * (1 + change / 100);
            
            return {
                id,
                symbol: id.slice(0, 3).toUpperCase(),
                name: id.charAt(0).toUpperCase() + id.slice(1),
                current_price: price,
                price_change_percentage_24h: parseFloat(change),
                market_cap: price * (Math.random() * 1000000 + 500000),
                total_volume: price * (Math.random() * 100000 + 50000),
                image: `https://cryptoicon-api.vercel.app/api/icon/${id}`
            };
        });
        
        // Simulate global market data
        const globalData = {
            total_market_cap: { usd: 2400000000000 },
            market_cap_percentage: { btc: 52.3 },
            total_volume: { usd: 84200000000 },
            active_cryptocurrencies: 12847
        };
        
        cachedData = {
            coins: simulatedData,
            global: globalData,
            timestamp: now
        };
        
        lastFetchTime = now;
        
        return cachedData;
        
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        
        // Return fallback data if API fails
        return {
            coins: [],
            global: {
                total_market_cap: { usd: 2400000000000 },
                market_cap_percentage: { btc: 52.3 },
                total_volume: { usd: 84200000000 },
                active_cryptocurrencies: 12847
            },
            timestamp: now,
            error: error.message
        };
    }
}

// Update the dashboard with fresh data
async function updateDashboard() {
    const data = await fetchCryptoData();
    
    // Update global stats
    if (data.global) {
        document.getElementById('total-market-cap').textContent = 
            `$${(data.global.total_market_cap.usd / 1e12).toFixed(1)}T`;
        
        document.getElementById('btc-dominance').textContent = 
            `${data.global.market_cap_percentage.btc.toFixed(1)}%`;
        
        document.getElementById('total-volume').textContent = 
            `$${(data.global.total_volume.usd / 1e9).toFixed(1)}B`;
        
        document.getElementById('active-currencies').textContent = 
            data.global.active_cryptocurrencies.toLocaleString();
    }
    
    // Update crypto table
    if (data.coins && data.coins.length > 0) {
        const tableBody = document.getElementById('crypto-table-body');
        if (tableBody) {
            tableBody.innerHTML = '';
            
            data.coins.forEach((coin, index) => {
                const change = coin.price_change_percentage_24h;
                const isPositive = change >= 0;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>
                        <div class="crypto-name">
                            <div class="crypto-icon">${coin.symbol.charAt(0)}</div>
                            <div>
                                <div><strong>${coin.name}</strong></div>
                                <div style="opacity: 0.7; font-size: 0.9rem;">${coin.symbol}</div>
                            </div>
                        </div>
                    </td>
                    <td><strong>$${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
                    <td>
                        <span class="price-change ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '+' : ''}${change.toFixed(2)}%
                        </span>
                    </td>
                    <td>$${(coin.market_cap / 1e9).toFixed(1)}B</td>
                    <td>$${(coin.total_volume / 1e9).toFixed(1)}B</td>
                `;
                tableBody.appendChild(row);
            });
        }
    }
    
    // Update last update time
    const now = new Date();
    document.getElementById('last-update').textContent = 
        `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    
    // Hide loading indicator if present
    const loadingElement = document.getElementById('crypto-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // Show table if hidden
    const tableElement = document.getElementById('crypto-table');
    if (tableElement) {
        tableElement.style.display = 'table';
    }
}

// Initialize exchange cards
function initializeExchanges() {
    const exchangesContainer = document.querySelector('.exchanges');
    if (!exchangesContainer) return;
    
    exchangesContainer.innerHTML = '';
    
    EXCHANGES.forEach(exchange => {
        const card = document.createElement('div');
        card.className = 'exchange-card';
        card.innerHTML = `
            <div class="exchange-header">
                <div class="exchange-logo">${exchange.logo}</div>
                <div class="exchange-name">${exchange.name}</div>
            </div>
            <ul class="exchange-features">
                <li><span>Trading Fees</span><span>${exchange.fees}</span></li>
                <li><span>Supported Coins</span><span>${exchange.coins}</span></li>
                <li><span>24h Volume</span><span>${exchange.volume}</span></li>
                <li><span>Trust Score</span><span>${exchange.trust}</span></li>
            </ul>
            <a href="${exchange.affiliateUrl}" target="_blank" class="affiliate-button" onclick="trackClick('${exchange.id}')">
                ${exchange.offer}
            </a>
        `;
        
        exchangesContainer.appendChild(card);
    });
}

// Track affiliate clicks
function trackClick(exchangeId) {
    // In production, send to analytics service
    console.log(`Affiliate click tracked: ${exchangeId} at ${new Date().toISOString()}`);
    
    // Simple localStorage tracking for demo
    try {
        let clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '{}');
        clicks[exchangeId] = (clicks[exchangeId] || 0) + 1;
        localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
        
        // Log to console for monitoring
        console.log(`Total clicks for ${exchangeId}: ${clicks[exchangeId]}`);
    } catch (e) {
        console.error('Error tracking click:', e);
    }
}

// Get click statistics
function getClickStats() {
    try {
        const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '{}');
        return clicks;
    } catch (e) {
        return {};
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize exchanges
    initializeExchanges();
    
    // Initial data load
    updateDashboard();
    
    // Set up periodic updates (every 5 minutes)
    setInterval(updateDashboard, CACHE_DURATION);
    
    // Also update every minute for price changes (but use cache for API)
    setInterval(() => {
        // Just update display with cached data
        if (cachedData) {
            updateDashboard();
        }
    }, 60000);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchCryptoData,
        updateDashboard,
        trackClick,
        getClickStats
    };
}