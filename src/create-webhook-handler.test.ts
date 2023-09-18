import { CreateWebhookHandler } from './create-webhook-handler';

test('returns 200 Hello World', async () => {
    const handler = new CreateWebhookHandler();

    const response = await handler.invoke();
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('{"hello":"World"}');
});

