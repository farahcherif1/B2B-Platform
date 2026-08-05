const MODE = process.env.NODE_ENV

const config = {
  apiDomain: MODE=="production" ? "https://dev.api.b2b.eventizer.io" : "http://localhost:3000",
};

export default config;
