import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup the MSW worker for the browser environment
export const worker = setupWorker(...handlers);
