import dotenv from "dotenv";
dotenv.config();

const allowedOriginsString = process.env.ALLOWED_ORIGINS;
export const allowedOrigins = allowedOriginsString ? allowedOriginsString.split(',') : [];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;