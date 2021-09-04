const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const db = require("./models/");
const cors = require("cors");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { client_id, redirect_uri, client_secret } = require("./config");

const config = require("./config");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));
// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.post("/authenticate", (req, res) => {
    const { code } = req.body;

    const data = new FormData();
    data.append("client_id", client_id);
    data.append("client_secret", client_secret);
    data.append("code", code);
    data.append("redirect_uri", redirect_uri);

    // Request to exchange code for an access token
    fetch(`https://github.com/login/oauth/access_token`, {
        method: "POST",
        body: data,
    })
        .then((response) => response.text())
        .then((paramsString) => {
            let params = new URLSearchParams(paramsString);
            const access_token = params.get("access_token");

            // Request to return data of a user that has been authenticated
            return fetch(`https://api.github.com/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            });
        })
        .then((response) => response.json())
        .then((response) => {
            return res.status(200).json(response);
        })
        .catch((error) => {
            return res.status(400).json(error);
        });
});

function success(res, payload) {
    return res.status(200).json(payload);
}

app.get("/todos", async (req, res, next) => {
    try {
        const todos = await db.Todo.find({});
        return success(res, todos);
    } catch (err) {
        next({ status: 400, message: "failed to get todos" });
    }
});

app.post("/todos", async (req, res, next) => {
    try {
        const todo = await db.Todo.create(req.body);
        return success(res, todo);
    } catch (err) {
        next({ status: 400, message: "failed to create todo" });
    }
});

app.put("/todos/:id", async (req, res, next) => {
    try {
        const todo = await db.Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        return success(res, todo);
    } catch (err) {
        next({ status: 400, message: "failed to update todo" });
    }
});
app.delete("/todos/:id", async (req, res, next) => {
    try {
        await db.Todo.findByIdAndRemove(req.params.id);
        return success(res, "todo deleted!");
    } catch (err) {
        next({ status: 400, message: "failed to delete todo" });
    }
});

app.use((err, req, res, next) => {
    return res.status(err.status || 400).json({
        status: err.status || 400,
        message: err.message || "there was an error processing request"
    });
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
