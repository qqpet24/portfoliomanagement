const BS = require("black-scholes");
class Asset{
    constructor() {
        this.dayPerYear = 365.0;
    }
    getValue(){
        return 0;
    }
}
class Option extends Asset{
    constructor(direction,strikePrice,time,iv,rate,amount,price) {
        super();
        this.direction = direction;
        this.strikePrice = strikePrice;
        this.expTime = time;
        this.iv = iv;
        this.rate = rate;
        this.amount = amount;
        this.price = price;
    }
    getValue(newPrice,newTime){
        let time = (this.expTime-newTime)/this.dayPerYear;
        let price = 0;
        if(time <= 0) time = 0.000000000000001;
        if(time > 0) price = BS.blackScholes(newPrice,this.strikePrice,time,this.iv,this.rate,this.direction);
        if(this.amount>=0) return this.amount*price;
        else return this.amount*(price-this.price);
    }
    toString(){
        return `option-amount: ${this.amount} -> ${this.strikePrice}-${this.direction}-${this.expTime} iv:${this.iv} rate:${this.rate} originalPrice:${this.price}`
    }
}
class Stock extends Asset{
    constructor(amount,price) {
        super();
        this.amount = amount;
        this.price = price;
    }
    getValue(newPrice,newTime){
        if(this.amount > 0) return newPrice*this.amount;
        else return this.amount*(newPrice-this.price);
    }
    toString(){
        return `stock-amount: ${this.amount} -> originalPrice:${this.price}`
    }
}
class Bond extends Asset{
    constructor(amount,apy,expireTime){
        super();
        this.amount = amount;
        this.apy = apy;
        this.expireTime = expireTime;
    }
    getValue(newPrice,newTime){
        let time = newTime>this.expireTime?this.expireTime:newTime;
        return this.amount*(1+this.apy*time/this.dayPerYear);
    }
    toString(){
        return `bond-amount: ${this.amount} -> apy:${this.apy} expireTime:${this.expireTime}`
    }
}
class Portfolio{
    constructor(symbol) {
        this.symbol = symbol;
        this.option=[];
        this.stock=[];
        this.bond=[];
        this.cost = 0;
    }
    insertOptions(direction,strikePrice,expireTime,iv,rate,amount,price){
        this.option.push(new Option(direction,strikePrice,expireTime,iv,rate,amount,price));
        this.cost += price;
    }
    insertStock(amount,price){
        this.stock.push(new Stock(amount,price));
    }
    insertBond(amount,apy,expireTime){
        this.bond.push(new Bond(amount,apy,expireTime));
    }
    getTotalValue(newPrice,newTime){
        let totalValue = 0;
        for(var i = 0;i<this.option.length;i++) totalValue += this.option[i].getValue(newPrice,newTime);
        for(var i = 0;i<this.stock.length;i++) totalValue += this.stock[i].getValue(newPrice,newTime);
        for(var i = 0;i<this.bond.length;i++) totalValue += this.bond[i].getValue(newPrice,newTime);
        return totalValue;
    }
    showTotalPortfolio(){
        console.log(toString());
    }
    toString(){
        let str = `Current portfolio:\n`;
        for(var i = 0;i<this.option.length;i++) str+=this.option[i].toString()+'\n';
        for(var i = 0;i<this.stock.length;i++) str+=this.stock[i].toString()+'\n';
        for(var i = 0;i<this.bond.length;i++) str+=this.bond[i].toString()+'\n';
        return str;
    }
    simulateValueResult(newTime,newPriceResult){
        let value = [];
        for(var i = 0;i<newPriceResult.length;i++) value.push(this.getTotalValue(newPriceResult[i],newTime));
        return value;
    }
}

module.exports = Portfolio;