#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import {AppStack} from './app-stack';

const app = new App();
const stage = process.env.STAGE || 'dev';
export const stack = new AppStack(app, `webhook-example-${stage}`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    stage
});
