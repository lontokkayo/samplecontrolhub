require("@babel/register")({
    presets: ["@babel/preset-env", "@babel/preset-react"]
});

const functions = require("firebase-functions");
const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const path = require("path");
const fs = require("fs");

const App = require("../App_SSR").default; // Adjust path if necessary

const app = express();

// Serve static files from the Expo web build
app.use(express.static(path.resolve(__dirname, "../web-build")));

// SSR for the main app
app.get("/*", (req, res) => {
    const appStream = ReactDOMServer.renderToString(React.createElement(App));

    const indexFile = path.resolve(__dirname, "../web-build/index.html");
    fs.readFile(indexFile, "utf8", (err, data) => {
        if (err) {
            console.error("Something went wrong:", err);
            return res.status(500).send("Oops, better luck next time!");
        }

        return res.send(
            data.replace('<div id="root"></div>', `<div id="root">${appStream}</div>`)
        );
    });
});

exports.ssr = functions.https.onRequest(app);
