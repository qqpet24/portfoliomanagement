const Gaussian = require("gaussian");
class PriceSimulator{
    getPriceByBSRandom(time,iv,price,rate,cnt){
        let t = time/365.0;
        let stdGaussianDistribution = Gaussian(0,1);
        let stdPriceList = stdGaussianDistribution.random(cnt);
        let priceList = [];
        for(var i = 0;i<stdPriceList.length;i++){
            priceList.push( price * Math.exp(rate*t - 0.5*iv*iv*t + iv*stdPriceList[i]*Math.sqrt(t)));
        }
        return priceList;
    }
    getPriceByRange(from,to,interval){
        let priceList = [];
        for(var i = from;i<to;i+=interval){
            priceList.push(i);
        }
        return priceList;
    }
}
module.exports = PriceSimulator;