import { Request, Response } from 'express';
declare const router: import("express-serve-static-core").Router;
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export declare function generateToken(payload: JwtPayload): string;
export declare function verifyToken(token: string): JwtPayload;
export declare function authMiddleware(req: Request, res: Response, next: any): Response<any, Record<string, any>> | undefined;
export declare function adminMiddleware(req: Request, res: Response, next: any): Response<any, Record<string, any>> | undefined;
export default router;
//# sourceMappingURL=auth.d.ts.map