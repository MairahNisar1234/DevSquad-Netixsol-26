import { Agent } from '@openai/agents';
export declare const getDocumentContent: import("@openai/agents").FunctionTool<unknown, {
    type: "object";
    properties: {};
    required: never[];
    additionalProperties: false;
}, string>;
export declare const countWords: import("@openai/agents").FunctionTool<unknown, {
    type: "object";
    properties: {};
    required: never[];
    additionalProperties: false;
}, string>;
export declare const analystAgent: Agent<unknown, "text">;
export declare const summaryAgent: Agent<unknown, "text">;
export declare const qaAgent: Agent<unknown, "text">;
export declare const routerAgent: Agent<unknown, "text">;
export declare const applyGuardrails: (input: string) => string | null;
