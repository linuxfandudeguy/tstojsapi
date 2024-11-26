import express from 'express';
import bodyParser from 'body-parser';
import * as ts from 'typescript';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/compile', (req, res) => {
    const { code } = req.body;

    if (typeof code !== 'string') {
        return res.status(400).json({ error: 'Invalid input. Provide TypeScript code as a string.' });
    }

    try {
        const result = ts.transpileModule(code, {
            compilerOptions: {
                target: ts.ScriptTarget.ES5,
                module: ts.ModuleKind.ESNext,
                strict: true,
                removeComments: true,
            },
        });
        res.json({ jsCode: result.outputText });
    } catch (err) {
        res.status(500).json({ error: 'Compilation failed', details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
