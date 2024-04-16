const app=require('./app.js')

const PORT=process.env.PORT || 1000

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})