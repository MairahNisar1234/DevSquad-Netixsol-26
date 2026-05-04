export declare class AgentsService {
    private readonly logger;
    processRequest(userMessage: string, pdfText: string): Promise<{
        success: boolean;
        error: string;
        data?: undefined;
        steps?: undefined;
    } | {
        success: boolean;
        data: string;
        steps: {
            agent: any;
            type: string;
            detail: any;
        }[];
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        steps: never[];
        data?: undefined;
    }>;
}
