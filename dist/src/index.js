import express from 'express';
import testApi from './routes/routes.js';
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json()); // Add this line to enable JSON parsing in the request body
app.use('/api', testApi); // Add this line to mount the Task API routes
app.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
