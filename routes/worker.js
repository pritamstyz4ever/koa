
module.exports = (router) => {
    router.post('/worker', async (ctx) => {
        // worker logic
        // ...
        ctx.body = { message: 'worker started' };
    });
};
