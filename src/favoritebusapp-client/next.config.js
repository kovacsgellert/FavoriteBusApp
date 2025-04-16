/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    // use Next.js as proxy for api calls to solve CORS issues
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.services__api__http__0}/api/:path*`
            },
        ]
    }
};

export default config;
