import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export class CreateWebhookHandler {

    invoke = (): Promise<APIGatewayProxyStructuredResultV2> => {
        return Promise.resolve({
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({hello: 'World'})
        });
    }
}

export const handler = new CreateWebhookHandler().invoke;
