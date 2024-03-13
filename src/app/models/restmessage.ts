export interface IRestMessage {
    code: number;
    message: string;
    status: string;
    error_message?: string;
    error_description?: string; 
    data?: any;
    token?: string;
}