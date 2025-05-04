document.getElementById('lookup').addEventListener('click', () => {
  const ticker = document.getElementById('ticker').value.toUpperCase();
  const range = document.getElementById('range').value;
  fetchStockData(ticker, range);
});

let stockChart = null;

function fetchStockData(ticker, days) {
  const to = new Date().toISOString().split('T')[0];
  const from = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=3CCRW2SD95dpd5iiBBQyE9iFzHqN1Tvj`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      

      const labels = data.results.map(r => new Date(r.t).toLocaleDateString());
      const values = data.results.map(r => r.c);
      const ctx = document.getElementById('stockChart').getContext('2d');

      if (stockChart) {
        stockChart.destroy();
      }

      stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: ticker,
            data: values,
            borderColor: 'blue',
            fill: false
          }]
        }
      });
      document.getElementById('stockChart').style.display = 'block';
      document.getElementById('stockChart').style.backgroundColor = 'white';
    });
}

// Reddit Stocks
fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
  .then(res => res.json())
  .then(data => {
    const top5 = data.slice(0, 5);
    const table = document.getElementById('redditStocks');
    table.innerHTML = '<tr><th>Ticker</th><th>Comment Count</th><th>Sentiment</th></tr>';
    top5.forEach(stock => {
      const icon = stock.sentiment === 'Bullish' ? '<img src="https://png.pngtree.com/png-vector/20250308/ourmid/pngtree-market-bullish-trend-logo-symbol-with-bull-silhouette-and-green-candlestick-vector-png-image_15466334.png" width="300px">' : '<img src="https://cdn-icons-png.flaticon.com/512/4964/4964784.png" width="300px">';
      table.innerHTML += `<tr><td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td><td>${stock.no_of_comments}</td><td>${icon}</td></tr>`;
    });
  });

  if (annyang) {
    const commands = {
      'Lookup *ticker': (ticker) => {
        ticker = ticker.toUpperCase();
        document.getElementById('ticker').value = ticker;
        const range = '30';
        fetchStockData(ticker, range);
      }
    };
    annyang.addCommands(commands);
  }