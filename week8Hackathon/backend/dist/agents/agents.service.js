"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AgentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const agents_1 = require("@openai/agents");
const agents_logic_1 = require("./agents.logic");
let AgentsService = AgentsService_1 = class AgentsService {
    logger = new common_1.Logger(AgentsService_1.name);
    async processRequest(userMessage, pdfText) {
        try {
            const guardrailError = (0, agents_logic_1.applyGuardrails)(userMessage);
            if (guardrailError)
                return { success: false, error: guardrailError };
            const sanitizedText = pdfText.replace(/\d{10,16}/g, '[REDACTED]').trim();
            if (sanitizedText.length < 10) {
                return {
                    success: true,
                    data: "The document appears to be empty or unreadable. Please upload a digital PDF.",
                    steps: []
                };
            }
            global.extractedText = sanitizedText;
            this.logger.log(`Starting Agent Runner. Context: ${sanitizedText.length} chars.`);
            const runner = new agents_1.Runner();
            const input = `
        USER REQUEST: ${userMessage}
        NOTE: Use your tools to read the document content.
      `;
            const result = await runner.run(agents_logic_1.routerAgent, input, { maxTurns: 10 });
            const steps = result.newItems
                .filter(item => item.type === 'message_output_item' ||
                item.type === 'tool_call_item' ||
                item.type === 'handoff_call_item')
                .map((item) => {
                const isTool = item.type === 'tool_call_item';
                const isHandoff = item.type === 'handoff_call_item';
                return {
                    agent: item.agentName || (isTool ? 'Specialist Tool' : 'Router'),
                    type: isHandoff ? 'handoff' : (isTool ? 'tool' : 'output'),
                    detail: isTool ? item.call?.function?.name : 'Processing request'
                };
            });
            let finalAnswer = '';
            for (let i = result.newItems.length - 1; i >= 0; i--) {
                const item = result.newItems[i];
                if (item.type === 'message_output_item') {
                    const rawContent = item.rawItem?.content;
                    if (Array.isArray(rawContent)) {
                        const textBlock = rawContent.find((c) => (c.type === 'text' || c.type === 'output_text') &&
                            c.text &&
                            !c.text.includes('transfer_to') &&
                            !c.text.includes('Traffic Controller'));
                        if (textBlock) {
                            finalAnswer = textBlock.text.trim();
                            break;
                        }
                    }
                }
            }
            return {
                success: true,
                data: finalAnswer || "Analysis complete, but no text summary was generated.",
                steps: steps
            };
        }
        catch (error) {
            this.logger.error(`AgentsService Error: ${error.message}`);
            return {
                success: false,
                error: "An error occurred during agent delegation.",
                steps: []
            };
        }
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = AgentsService_1 = __decorate([
    (0, common_1.Injectable)()
], AgentsService);
//# sourceMappingURL=agents.service.js.map