require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const path = require('path');

const app = express();
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/views"))
// app.set('views', __dirname + 'views')
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/ask", async (req, res) => {
    const prompt = req.body.prompt;

    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: 1000
        });
        const completion = response.data.choices[0].text;

        return res.status(200).json({
            success: true,
            message: completion,
        });
    } catch (error) {
        console.log(error.message);
    }
});

app.post("/generate", async (req, res) => {
    const prompt = req.body.prompt;
    const size = req.body.size;

    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }
        console.log(prompt, size);
        const response = await openai.createImage({
            prompt,
            n: 1,
            size
        });
        image_url = response.data.data[0].url;
        // console.log(image_url);
        // const completion = response.data.choices[0].text;

        return res.status(200).json({
            success: true,
            image_url: image_url
        })
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            return res.status(400).json({
                success: false,
                message: "Ughh ohh, something went wrong",
            });
        } else {
            console.log(error.message);
            return res.status(400).json({
                success: false,
                message: "Ughh ohh, something went wrong",
            });
        }
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));