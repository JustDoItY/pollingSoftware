const axios = require('axios').default;
const cheerio = require('cheerio');

function random() {
  return Math.round(Math.random()*(2-1)+1); // 返回一个随机数字
}

async function main() {
  const proxies = [];
  {
    try {
      const {data} = await axios("get", {url: `http://www.xicidaili.com/2018-09-13/shandong`});
      const $ = cheerio.load(data);
      const trs = $("tbody").children();
      const result = trs.map(function (index) {
        if (index >0){
        const el = $(this).children();
        return {
          host: el.eq(1).text().trim(),
          port: +el.eq(2).text().trim(),
        };
        }
      });
  
      proxies.push(...result.toArray());
      console.log(proxies)
    } catch (e) {
      console.log(e);
    }
  }
};

main();