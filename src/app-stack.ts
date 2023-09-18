import {Stack, StackProps} from 'aws-cdk-lib';
import * as path from 'path';
import {Construct} from 'constructs';
import {Code, Runtime, Function} from 'aws-cdk-lib/aws-lambda';
import {Cors, EndpointType, LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {Certificate} from 'aws-cdk-lib/aws-certificatemanager';
import {ARecord, HostedZone, RecordTarget} from 'aws-cdk-lib/aws-route53';
import {ApiGateway} from 'aws-cdk-lib/aws-route53-targets';

export type AppStackProps = StackProps & {
    stage: string,
};

export class AppStack extends Stack {
    constructor(scope: Construct, id: string, props: AppStackProps) {
        super(scope, id, props);

        const apiFunction = new Function(this, 'create-webhook-function', {
            runtime: Runtime.NODEJS_16_X,
            handler: 'create-webhook-handler',
            code: Code.fromAsset(path.join(__dirname, '..', 'build')),
            environment: {
                STAGE: props.stage
            }
        });

        const lambdaIntegration = new LambdaIntegration(apiFunction);

        const api = new RestApi(this, `${props.stage}Api`, {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS
            }
        });

        api.root.addMethod('POST', lambdaIntegration);

        const cert = Certificate.fromCertificateArn(
            this,
            'cert',
            'arn:aws:acm:us-east-1:084882962555:certificate/729d47e9-8d3b-439c-b4b5-e74a9a33cbce'
        );

        api.addDomainName('DomainName', {
            domainName: `${props.stage}-webhooks.api.helpfl.click`,
            certificate: cert,
            endpointType: EndpointType.EDGE,
            basePath: 'webhook'
        });

        new ARecord(this, 'ARecord', {
            recordName: `${props.stage}-webhooks.api.helpfl.click`,
            target: RecordTarget.fromAlias(new ApiGateway(api)),
            zone: HostedZone.fromLookup(this, 'HostedZone', {
                domainName: 'helpfl.click'
            })
        });

    }
}
