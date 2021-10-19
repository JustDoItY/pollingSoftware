const axios = require('axios').default;
const cheerio = require('cheerio');

function random() {
  return Math.round(Math.random()*(5-1)+1); // 返回一个随机数字
}
let time = null;
async function main(page) {
  const proxies = [];
  
  {
    //axios.get(`http://www.89ip.cn/index_${2}.html`);
    const { data } = await axios("get",{url: `http://www.superfastip.com/welcome/freeip/${page}`});
    const $ = cheerio.load(data);
    const trs = $("tbody").children();
    const result = trs.map(function () {
      //const el = this.children[0].firstElementChild.innerHTML
      //console.log(el)
      const el = $(this).children();
      return {
        host: el.first().text().trim(),
        port: +el.eq(1).text().trim(),
      };
    });
    
    proxies.push(...result.toArray());
    console.log(proxies)
  }
  
  // 添加一个东西
  
  let index = 0;
  let i = 0;
  let errTotal = 0;
  
  function testIPIsNull() { // 检测是否ip使用完毕
    if (index > proxies.length) {
      clearInterval(time);
      main(random())
      console.log('结束');
    }
  }
  // 开始新的一轮之前，清除原来的interval
  clearInterval(time);
  time = setInterval(function () {
    axios({
      proxy: proxies[index],
      method: 'post',
      url: 'http://vote.cyzone.cn/api/v1/vote/submit',
      data: {
        id: 575,
        act_id: 11
      }
    })
    .then(function(response){
      console.log(i++,'成功',response.data.msg);
      if (response.data.msg == "该IP段不再允许对该活动投票" || response.data.msg == "请求参数不合法" || !response.data.msg) {
        index++;
      }
      errTotal = 0;
      testIPIsNull();
    })
    .catch(function(error){
      errTotal++;
      console.log('失败', error.data, errTotal);
      
      if (errTotal>15) {
        index++;
        errTotal = 0;
        console.log('换')
      }
      testIPIsNull();
    })
  },200);
};

main(random());

