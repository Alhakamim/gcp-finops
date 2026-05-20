declare class SyncDb {
    run(sql: string, params?: any[]): number;
    get(sql: string, params?: any[]): any;
    all(sql: string, params?: any[]): any[];
    prepare(sql: string): {
        run: (...params: any[]) => {
            changes: number;
        };
        get: (...params: any[]) => any;
        all: (...params: any[]) => any[];
    };
    exec(sql: string): void;
    close(): void;
}
export declare function initDb(): Promise<SyncDb>;
export declare function getDb(): SyncDb;
export declare function closeDb(): void;
export {};
//# sourceMappingURL=db.d.ts.map