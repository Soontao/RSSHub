/* eslint-disable no-console */
// tracing.js

'use strict';

const process = require('process');

if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT !== undefined) {
    const os = require('os');
    const opentelemetry = require('@opentelemetry/sdk-node');
    const { Resource } = require('@opentelemetry/resources');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-grpc');
    const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');


    // ref: https://github.com/open-telemetry/opentelemetry-js/blob/main/experimental/packages/exporter-trace-otlp-grpc/README.md#traces-in-node---grpc
    const traceExporter = new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    });
    // configure the SDK to export telemetry data to the console
    // enable all auto-instrumentations from the meta package
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
        .then(() => console.info('Tracing initialized'))
        .catch((error) => console.error('Error initializing tracing', error));

    // gracefully shut down the SDK on process exit
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => console.info('Tracing terminated'))
            .catch((error) => console.error('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
} else {
    console.log('OTEL_EXPORTER_OTLP_ENDPOINT env is not configured, skip otlp setup');
}
