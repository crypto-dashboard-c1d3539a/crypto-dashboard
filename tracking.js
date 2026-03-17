// Simple affiliate click tracking
const TRACKING_ENDPOINT = 'https://webhook.site/#!/'; // Replace with actual endpoint

function trackClick(exchange) {
    console.log(`Affiliate click tracked: ${exchange} at ${new Date().toISOString()}`);
    
    // In a real implementation, send to analytics service
    // fetch(TRACKING_ENDPOINT, {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({
    //         exchange: exchange,
    //         timestamp: new Date().toISOString(),
    //         referrer: document.referrer,
    //         userAgent: navigator.userAgent
    //     })
    // });
    
    // Store locally for demo
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    clicks.push({
        exchange: exchange,
        timestamp: new Date().toISOString(),
        url: window.location.href
    });
    localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
    
    // Show notification
    showClickNotification(exchange);
}

function showClickNotification(exchange) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-family: 'Segoe UI', sans-serif;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">🎯 Redirecting to ${exchange}</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">Affiliate link clicked - commission tracking active</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Affiliate tracking system loaded');