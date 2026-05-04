import { AgentsService } from './agents.service';
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    analyze(file: Express.Multer.File, message: string): Promise<{
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
