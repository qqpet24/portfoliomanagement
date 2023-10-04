const PriceSimulator = require('./PriceSimulator');
const Portfolio = require('./Portfolio');
const BS = require('black-scholes');
let portfolio = new Portfolio("Test Corporate");
let Chart;
let valuePriceChart;
let priceFrom = 100;
let priceTo = 500;
let priceInterval = 1;
let showChartTime = 0;

//npx parcel ./index.html
(async ()=>{
    Chart = (await import('chart.js')).Chart;
    let registerables = (await import('chart.js')).registerables;
    Chart.register(...registerables);
    document.getElementById("changeChartRange").onclick=changeChartRange;
    document.getElementById("insertOptions").onclick=insertOptions;
    document.getElementById("insertStock").onclick=insertStock;
    document.getElementById("insertBond").onclick=insertBond;
    document.getElementById("clearPortfolio").onclick=clearPortfolio;
    document.getElementById("showDemo").onclick=showDemo;

    valuePriceChart = new Chart(
        document.getElementById('dimensions'),
        {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: `Value of portfolio (X-axis: price of asset, Y-axis: value of portfolio)`,
                        data: []
                    }
                ]
            }
        }
    );

    showDemo();
})();
function changeChartRange(){
    function getOrDefault(id,defaultValue){
        if(document.getElementById(id).value !== ""){
            return parseFloat(document.getElementById(id).value);
        }else{
            return defaultValue;
        }
    }
    priceFrom = getOrDefault("priceFrom",priceFrom);
    priceTo = getOrDefault("priceTo",priceTo);
    priceInterval = getOrDefault("priceInterval",priceInterval);
    showChartTime = getOrDefault("showChartTime",showChartTime);
    renewChart();
}
function insertOptions(){
    let type = document.getElementById("OptionType").value;
    let strikePrice = document.getElementById("StrikePrice").value;
    let expTime  = document.getElementById("expireTime").value;
    let iv = document.getElementById("iv").value;
    let rate = document.getElementById("rate").value;
    let amount = document.getElementById("amount").value;
    let price = document.getElementById("price").value;
    portfolio.insertOptions(type,strikePrice,expTime,iv,rate,amount,price);
    renewChart();
}
function insertStock(){
    let amount = document.getElementById("stockAmount").value;
    let price = document.getElementById("stockPrice").value;
    portfolio.insertStock(amount,price);
    renewChart();
}
function insertBond(){
    let amount = document.getElementById("bondAmount").value;
    let apy = document.getElementById("bondAPY").value;
    let expireTime = document.getElementById("bondMaturityDate").value;
    portfolio.insertBond(amount,apy,expireTime);
    renewChart();
}
function clearPortfolio(){
    portfolio = new Portfolio("Test Corporate");
    renewChart();
}
function showDemo(){
    portfolio = new Portfolio("Test Corporate");
    portfolio.insertOptions("call",200,30,0.55,0.05,-1,25);
    portfolio.insertOptions("put",125,30,0.55,0.05,-1,25);
    portfolio.insertOptions("call",300,30,0.55,0.05,1,2);
    portfolio.insertOptions("call",350,30,0.55,0.05,1,1);
    renewChart();
}
function renewChart(){
    document.getElementById("currentPortfolio").innerText = portfolio.toString();
    let priceList = new PriceSimulator().getPriceByRange(priceFrom,priceTo,priceInterval);
    let valueList = portfolio.simulateValueResult(showChartTime,priceList);
    valuePriceChart.data.labels = priceList;
    valuePriceChart.data.datasets[0].data = valueList;
    valuePriceChart.update();
}