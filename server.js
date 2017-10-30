import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import _debug from 'debug'

const app = express()
const port = process.env.port || process.env.PORT || 2509

global.ROOTPATH = path.join(__dirname,'dist')

//config
app.set('port',port)
app.use(cors())
app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
app.use(express.static(global.ROOTPATH))

app.get('/**',(request,response)=>{
    response.sendFile('index.html',{root:global.ROOTPATH})
})

(async () => {
    const debug = _debug('app:bin:server')
    // module.parent check is required to support mocha watch
    // src: https://github.com/mochajs/mocha/issues/1912
    if (!module.parent) {
      // listen on port config.port
      app.listen(app.get('port'),()=>{
        console.info(`server started on port ${port} (${process.env})`); // eslint-disable-line no-console
    })
    }
  
    debug(`Server is now running at http://${process.env.host}:${port}.`)
    debug(`Server accessible via localhost:${port} if you are using the project defaults.`)
  })()
  
  export default app
  