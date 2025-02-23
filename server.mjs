import express from 'express'
const app = express();

app.use('/', express.static('.'))
app.listen(8000, () => console.log('Server listening on port 8000'));

