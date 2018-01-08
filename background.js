function show(title, message, symbol) {
    var time = /(..)(:..)/.exec(new Date());
    var hour = time[1] % 12 || 12;
    var period = time[1] < 12 ? 'a.m.' : 'p.m.';
    var notification = new Notification(title + ' - ' + hour + time[2] + ' ' + period, {
        icon: 'logo.png',
        body: message,
        requireInteraction: true
    });
    notification.onclick = function () {
        window.open("https://www.binance.com/trade.html?symbol=" + symbol);
        notification.close();
    };
}

function get_prices() {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            localStorage.prices = http.responseText;
            update_prices();
        }
    };
    http.open("GET", "https://api.binance.com//api/v1/ticker/allPrices", true);
    http.send();
}

function process_alert_map() {
    var currencies = JSON.parse(localStorage.alert_map || "{}");
    for (var i = 0; i < currencies.length; i++) {
        var currency = currencies[i];
        var stored_prices = JSON.parse(localStorage.prices);
        for (var j = 0; j < stored_prices.length; j++) {
            var stored_price = stored_prices[j];
            if (stored_price.symbol == currency.coin) {
                if ((currency.buy === true) && (Number(stored_price.price) < Number(currency.price))) {
                    let new_target = Number((stored_price.price * 0.9).toFixed(8));
                    show("Buy Alert", stored_price.symbol + " < " + currency.price + ". Current price is " + stored_price.price + ".\nReducing target to " + new_target, stored_price.symbol);
                    currencies[i].price = new_target;
                    localStorage.alert_map = JSON.stringify(currencies);
                    update_prices();
                } else if ((currency.buy === false) && (Number(stored_price.price) > Number(currency.price))) {
                    let new_target = Number((stored_price.price * 1.1).toFixed(8));
                    show("Sell Alert", stored_price.symbol + " < " + currency.price + ". Current price is " + stored_price.price + ".\nReducing target to " + new_target, stored_price.symbol);
                    currencies[i].price = new_target;
                    localStorage.alert_map = JSON.stringify(currencies);
                    update_prices();
                }
            }
        }
    }
}

function update_prices() {
    chrome.runtime.sendMessage({ update: true });
}

get_prices();
setInterval(function () {
    if (localStorage.alert_map && localStorage.alert_map !== "[]") {
        get_prices();
        process_alert_map();
    }
}, 10000);
