
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.unsubscribe(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

const port = 3200
let crawler;
const getCrawler = async () => {
  if(!crawler) crawler = await require("./Crawler").getInstance()
  return crawler
}
getCrawler()

app.post('/', async (req, res) => {
  
  const crawler = await getCrawler()
  const rst = await crawler.getData(
    req.body.hallNumber,
    req.body.weekDay,
    req.body.options
  )
  res.send(rst)

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})