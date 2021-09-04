(async () => {
  async function getData(from, to) {
    // console.log(`http://api.marketstack.com/v1/eod?access_key=ec238c5d153994133438f83a770b57c6&symbols=AMZN&date_from=${from}&date_to=${to}`)
    // let r = await fetch(`http://api.marketstack.com/v1/eod?access_key=ec238c5d153994133438f83a770b57c6&symbols=AMZN&date_from=${from}&date_to=${to}`)
    // let j = await r.json()
    // console.log(j)
    // return j.data.map(e => e.close);
    return Array(30).fill().map(() => Math.random())
  }
  function viewChart(arr, canvas, label) {
    const labels = Array(arr.length).fill(null).map((v, i) => i + 1);
    let bestI = getTheBestIndex(arr);
  
    let backgroundColor = Array(arr.length).fill().map((e, i) => {
      if (bestI == i && bestI != 0) return "blue";
      return 'rgb(255, 99, 132)';
    })
  
    const data = {
      labels: labels,
      datasets: [{
        label,
        backgroundColor: backgroundColor,
        borderColor: 'rgb(255, 99, 132)',
        data: arr,
      }
    ]
    };
  
    const config = {
      type: 'bar',
      data,
      options: {}
    };
  
  
    var myChart = new Chart(
      canvas,
      config
    );
    
    return arr[bestI]
  }
  
  let getTheBestIndex = (arr) => {
    let best = 0;
    let resI = 0;
    let finded = false;
    let m = Math.round(arr.length / Math.E);
    arr.forEach((v, i) => {
      if (i <= m && best < v) best = v;
      else if (i > m && !finded && v > best) {
        resI = i;
        finded = true;
      }
    });
    return resI;
  }

  function runTests(numberTests, n) {
    let res = [];
    Array(numberTests).fill().forEach(() => {
      res.push(runTest(n))
    })
    return res;
  }

  function viewTests(testsRes, n) {
    let middleDelta = testsRes.reduce((acc, v) => {
      return acc + v.delta
    }, 0)/testsRes.length * 100 / Math.max.apply(null, testsRes.map(v => v.delta))

    document.querySelector(".it-num").innerHTML = `Количество дней в одном тесте: ${n}`
    document.querySelector(".num-tests").innerHTML = `Количество тестов: ${testsRes.length}`
    document.querySelector(".middle").innerHTML = `Среднее отклонение от максимального значения: ${Math.round(middleDelta * 100)/100}%`
  }

  function runTest(n) {
    let arr = Array(n).fill(null).map(() => Math.random())

    let bestI = getTheBestIndex(arr);

    return {
      delta: Math.max.apply(null, arr) - arr[bestI]
    }
  }

  let n = 100;
  // viewTests(runTests(10000, n), n)

  function getDates(start, end) {
    let res = [];
    start = new Date(start)
    end = new Date(end)
    let sum = start.getTime();
    let mounth = 1000 * 60 * 60 * 24 *30;
    let now, minutes, hours;
    let i = 0;
    console.log(sum, end.getTime(), mounth)
    while (sum < end.getTime() + 1) {
      i++
      now = new Date(sum)
      let m1 = String(i % 13).length == 1 ? "0" + String(i % 13) : i % 13; 
      let m2 = String((i+ 1) % 13).length == 1 ? "0" + String((i+ 1) % 13) : (i+ 1) % 13;
      if (m1 != "12" && m1 != "00") {
        res.push({
          start: `${now.getFullYear()}-${m1}-01`,
          end: `${now.getFullYear()}-${m2}-01`
        })
      }
      sum += mounth
    }
    return res;
  }

  async function test(start, end) {
    let container = document.createElement("div");
    document.querySelector(".res").insertAdjacentElement("beforeend", container);
    let canvas = document.createElement("canvas");
    container.insertAdjacentElement("beforeend", canvas);
    let div = document.createElement("div");
    container.insertAdjacentElement("beforeend", div);
    let arr = await getData(start, end);
    
    let best = viewChart(arr, canvas, start);
    let delta = Math.max.apply(null, arr) - best
    
    div.innerHTML = `Отклонение от максимального значения: ${Math.round(delta * 100)/100}%`
    return best;
  }

  let dates = getDates("2010-09-06", "2021-01-01");
  console.log(dates)
  let diff = 0;
  let lastVal = 0;
  dates.forEach(async (e, i) => {
    setTimeout(async () => {
      if (i % 2 == 0) {
        lastVal = await test(e.start, e.end);
      } else {
        diff = await test(e.start, e.end) - lastVal;
        let div = document.createElement("div")
        div.style = "width: 100% !important";
        div.innerHTML = "Разница между покупкой и продажей:" + Math.round(diff * 100) / 100 + "$";
        document.querySelector(".res").insertAdjacentElement("beforeend", div)
      }
    }, i * 500)
  })
})()
