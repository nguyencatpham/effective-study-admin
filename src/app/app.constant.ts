let domain = {
    development: 'http://localhost:2508/api/',
};

export const AppConstant = {
    clientId: '1',
    clientSecret: '160b935e-9e8c-45c5-8949-d1c681650a08',
    pattern: {
        email: '[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})'
    },
    // domain: domain.default,
    domain: domain[process.env.NODE_ENV] ? domain[process.env.NODE_ENV] : 'http://api.reewod.com'
};

