var whitelist =
    process.env.NODE_ENV === "production"
        ? ["https://recigo.com.br", "https://powergo.com.br", "https://flowgo.com.br", "https://savego.com.br", "https://goplataforma.com.br"]
        : ["http://localhost", "http://localhost:3000", "http://localhost:5173", "http://192.168.15.35", "http://127.0.0.1", undefined];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
};

module.exports = { corsOptions };
