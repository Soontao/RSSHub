/* eslint-disable no-console */
// tracing.js

'use strict';

const process = require('process');
const os = require('os');
const opentelemetry = require('@opentelemetry/sdk-node');
const { Resource } = require('@opentelemetry/resources');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-grpc');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const logger = require('@/utils/logger');

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
const traceExporter = new OTLPTraceExporter();
const sdk = new opentelemetry.NodeSDK({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'RSSHub',
        [SemanticResourceAttributes.PROCESS_PID]: String(process.pid),
        [SemanticResourceAttributes.HOST_NAME]: os.hostname(),
    }),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()]
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start()
    .then(() => logger.info('Tracing initialized'))
    .catch((error) => logger.error('Error initializing tracing', error));

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => logger.info('Tracing terminated'))
        .catch((error) => logger.error('Error terminating tracing', error))
        .finally(() => process.exit(0));
});
