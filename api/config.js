const path = require("path");

const Joi = require( "joi" );

const { config } = require("dotenv");

config({ path: path.resolve(__dirname, "../.env") });

const Config = {
    client_id: "e6e3ad17f46dd71c1fc4",
    redirect_uri: 'http://localhost:3000/login',
    client_secret: "b96f70ff0f1f7a7e839cbdf884bd68da10fb6762",
    proxy_url: "http://localhost:5000/authenticate"
};

const envVarsSchema = Joi.object({
    client_id: Joi.string().required(),
    redirect_uri: Joi.string().required(),
    client_secret: Joi.string().required(),
    proxy_url: Joi.string().required()
});

const { error } = envVarsSchema.validate(Config);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = Config;