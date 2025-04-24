import knex, { Knex } from 'knex';
import { Logger } from '@adonisjs/core/logger';
import { Emitter } from '@adonisjs/core/events';
import { Application } from '@adonisjs/core/app';
import { DatabaseConfig, ConnectionConfig, ConnectionContract, QueryClientContract } from '../src/types/database.js';
import { RawQueryBuilderContract, InsertQueryBuilderContract, DatabaseQueryBuilderContract } from '../src/types/querybuilder.js';
import { BaseSchema } from '../src/schema/main.js';
import { Database } from '../src/database/main.js';
import { Adapter } from '../src/orm/adapter/index.js';
import { MigratorOptions } from '../src/types/migrator.js';
import { MigrationRunner } from '../src/migration/runner.js';
import { LucidRow, LucidModel, AdapterContract } from '../src/types/model.js';
export declare const APP_ROOT: import("url").URL;
export declare const SQLITE_BASE_PATH: string;
export declare const emitter: Emitter<any>;
export declare const logger: Logger<{}>;
export declare const createEmitter: () => Emitter<any>;
/**
 * Returns config based upon DB set in environment variables
 */
export declare function getConfig(): ConnectionConfig;
/**
 * Returns an instance of knex for testing
 */
export declare function getKnex(config: knex.Knex.Config): knex.Knex;
/**
 * Does base setup by creating databases
 */
export declare function setup(destroyDb?: boolean): Promise<void>;
/**
 * Does cleanup removes database
 */
export declare function cleanup(customTables?: string[]): Promise<void>;
/**
 * Reset database tables
 */
export declare function resetTables(): Promise<void>;
/**
 * Returns the query client typed to it's interface
 */
export declare function getQueryClient(connection: ConnectionContract, eventEmitter?: Emitter<any>, mode?: 'read' | 'write' | 'dual'): QueryClientContract;
/**
 * Returns query builder instance for a given connection
 */
export declare function getQueryBuilder(client: QueryClientContract): DatabaseQueryBuilderContract;
/**
 * Returns raw query builder instance for a given connection
 */
export declare function getRawQueryBuilder(client: QueryClientContract, sql: string, bindings?: any[]): RawQueryBuilderContract;
/**
 * Returns query builder instance for a given connection
 */
export declare function getInsertBuilder(client: QueryClientContract): InsertQueryBuilderContract;
/**
 * Returns the database instance
 */
export declare function getDb(eventEmitter?: Emitter<any>, config?: DatabaseConfig): Database;
/**
 * Returns the orm adapter
 */
export declare function ormAdapter(db: Database): Adapter;
/**
 * Returns the base model with the adapter attached to it
 */
export declare function getBaseModel(adapter: AdapterContract): LucidModel;
/**
 * Fake adapter implementation
 */
export declare class FakeAdapter implements AdapterContract {
    operations: any[];
    private _handlers;
    private _invokeHandler;
    query(): any;
    on(action: 'insert', handler: (model: LucidRow, attributes: any) => void): void;
    on(action: 'update', handler: (model: LucidRow, attributes: any) => void): void;
    on(action: 'delete', handler: (model: LucidRow) => void): void;
    on(action: 'refresh', handler: (model: LucidRow) => void): void;
    on(action: 'find', handler: (model: LucidModel, options?: any) => void): void;
    on(action: 'findAll', handler: (model: LucidModel, options?: any) => void): void;
    modelClient(): any;
    modelConstructorClient(): any;
    insert(instance: LucidRow, attributes: any): Promise<any>;
    refresh(instance: LucidRow): Promise<any>;
    delete(instance: LucidRow): Promise<any>;
    update(instance: LucidRow, attributes: any): Promise<any>;
    find(model: LucidModel, key: string, value: any, options?: any): Promise<any>;
    findAll(model: LucidModel, options?: any): Promise<any>;
}
/**
 * Converts a map to an object
 */
export declare function mapToObj<T extends any>(collection: Map<any, any>): T;
/**
 * Returns the base schema class typed to it's interface
 */
export declare function getBaseSchema(): typeof BaseSchema;
/**
 * Returns instance of migrator
 */
export declare function getMigrator(db: Database, application: Application<any>, config: MigratorOptions): MigrationRunner;
/**
 * Split string to an array using cross platform new lines
 */
export declare function toNewlineArray(contents: string): string[];
/**
 * Returns an array of users filled with random data
 */
export declare function getUsers(count: number): {
    username: string;
    email: string;
}[];
/**
 * Returns an array of posts for a given user, filled with random data
 */
export declare function getPosts(count: number, userId: number): {
    user_id: number;
    title: string;
}[];
export declare function setupReplicaDb(connection: Knex, datatoInsert: {
    username: string;
}[]): Promise<void>;
export declare function cleanupReplicaDb(connection: Knex): Promise<void>;
export declare function sleep(timeout: number): Promise<unknown>;
export declare function replaceFactoryBindings(source: string, model: string, importPath: string): string[];
