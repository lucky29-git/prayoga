const express = require('express');
const app = express();
const userRouter = require('../routes/userRoutes')
const provisionRouter = require('../routes/provisionRoutes')
const resourceRouter = require('../routes/resourceRoutes')
const PORT = 3000;
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/prayoga/api/v1/users', userRouter);
app.use('/prayoga/api/v1/provision', provisionRouter);
app.use('/prayoga/api/v1/resources', resourceRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




