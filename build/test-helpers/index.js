/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import dotenv from 'dotenv';
import { Chance } from 'chance';
import { join } from 'node:path';
import knex from 'knex';
import { fileURLToPath } from 'node:url';
import { getActiveTest } from '@japa/runner';
import { Logger } from '@adonisjs/core/logger';
import { Emitter } from '@adonisjs/core/events';
import { AppFactory } from '@adonisjs/core/factories/app';
import { BaseSchema } from '../src/schema/main.js';
import { Database } from '../src/database/main.js';
import LibSQLClient from '../src/clients/libsql.cjs';
import { Adapter } from '../src/orm/adapter/index.js';
import { BaseModel } from '../src/orm/base_model/index.js';
import { QueryClient } from '../src/query_client/index.js';
import { MigrationRunner } from '../src/migration/runner.js';
import { RawQueryBuilder } from '../src/database/query_builder/raw.js';
import { InsertQueryBuilder } from '../src/database/query_builder/insert.js';
import { DatabaseQueryBuilder } from '../src/database/query_builder/database.js';
dotenv.config();
export const APP_ROOT = new URL('./tmp', import.meta.url);
export const SQLITE_BASE_PATH = fileURLToPath(APP_ROOT);
const app = new AppFactory().create(APP_ROOT, () => { });
export const emitter = new Emitter(app);
export const logger = new Logger({});
export const createEmitter = () => new Emitter(app);
/**
 * Returns config based upon DB set in environment variables
 */
export function getConfig() {
    switch (process.env.DB) {
        case 'sqlite':
            return {
                client: 'sqlite3',
                connection: {
                    filename: join(SQLITE_BASE_PATH, 'db.sqlite'),
                },
                useNullAsDefault: true,
                debug: !!process.env.DEBUG,
            };
        case 'libsql':
            return {
                client: 'libsql',
                connection: {
                    filename: `file:${join(SQLITE_BASE_PATH, 'libsql.db')}`,
                },
                useNullAsDefault: true,
                debug: !!process.env.DEBUG,
            };
        case 'better_sqlite':
            return {
                client: 'better-sqlite3',
                connection: {
                    filename: join(SQLITE_BASE_PATH, 'better-sqlite-db.sqlite'),
                },
                useNullAsDefault: true,
                debug: !!process.env.DEBUG,
            };
        case 'mysql':
            return {
                client: 'mysql2',
                connection: {
                    host: process.env.MYSQL_HOST,
                    port: Number(process.env.MYSQL_PORT),
                    database: process.env.MYSQL_DATABASE,
                    user: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASSWORD,
                },
                debug: !!process.env.DEBUG,
                useNullAsDefault: true,
            };
        case 'mysql_legacy':
            return {
                client: 'mysql2',
                connection: {
                    host: process.env.LEGACY_MYSQL_HOST,
                    port: Number(process.env.LEGACY_MYSQL_PORT),
                    database: process.env.LEGACY_MYSQL_DATABASE,
                    user: process.env.LEGACY_MYSQL_USER,
                    password: process.env.LEGACY_MYSQL_PASSWORD,
                },
                debug: !!process.env.DEBUG,
                useNullAsDefault: true,
            };
        case 'pg':
            return {
                client: 'pg',
                connection: {
                    host: process.env.PG_HOST,
                    port: Number(process.env.PG_PORT),
                    database: process.env.PG_DATABASE,
                    user: process.env.PG_USER,
                    password: process.env.PG_PASSWORD,
                },
                debug: !!process.env.DEBUG,
                useNullAsDefault: true,
            };
        case 'mssql':
            return {
                client: 'mssql',
                connection: {
                    server: process.env.MSSQL_HOST,
                    port: Number(process.env.MSSQL_PORT),
                    user: process.env.MSSQL_USER,
                    password: process.env.MSSQL_PASSWORD,
                    database: 'master',
                    options: {
                        enableArithAbort: true,
                    },
                },
                debug: !!process.env.DEBUG,
                pool: {
                    min: 0,
                    idleTimeoutMillis: 300,
                },
            };
        default:
            throw new Error(`Missing test config for ${process.env.DB} connection`);
    }
}
/**
 * Returns an instance of knex for testing
 */
export function getKnex(config) {
    return knex.knex(Object.assign({}, {
        ...config,
        client: config.client === 'libsql' ? LibSQLClient : config.client,
    }, { debug: false }));
}
/**
 * Does base setup by creating databases
 */
export async function setup(destroyDb = true) {
    const db = getKnex(Object.assign({}, getConfig(), { debug: false }));
    const hasUsersTable = await db.schema.hasTable('users');
    if (!hasUsersTable) {
        await db.schema.createTable('users', (table) => {
            table.increments();
            table.integer('country_id');
            table.integer('tenant_id').nullable();
            table.string('username').unique();
            table.string('email').unique();
            table.integer('points').defaultTo(0);
            table.timestamp('joined_at', { useTz: process.env.DB === 'mssql' });
            table.integer('parent_id').nullable();
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasUuidUsers = await db.schema.hasTable('uuid_users');
    if (!hasUuidUsers) {
        await db.schema.createTable('uuid_users', (table) => {
            table.uuid('id').primary();
            table.string('username').unique();
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasFollowTable = await db.schema.hasTable('follows');
    if (!hasFollowTable) {
        await db.schema.createTable('follows', (table) => {
            table.increments();
            table.integer('user_id');
            table.integer('following_user_id');
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasFriendsTable = await db.schema.hasTable('friends');
    if (!hasFriendsTable) {
        await db.schema.createTable('friends', (table) => {
            table.increments();
            table.string('username').unique();
            table.timestamp('created_at').defaultTo(db.fn.now());
            table.timestamp('updated_at').nullable();
        });
    }
    const hasCountriesTable = await db.schema.hasTable('countries');
    if (!hasCountriesTable) {
        await db.schema.createTable('countries', (table) => {
            table.increments();
            table.string('name');
            table.timestamps();
        });
    }
    const hasSkillsTable = await db.schema.hasTable('skills');
    if (!hasSkillsTable) {
        await db.schema.createTable('skills', (table) => {
            table.increments();
            table.string('name').notNullable();
            table.timestamps();
        });
    }
    const hasUserSkillsTable = await db.schema.hasTable('skill_user');
    if (!hasUserSkillsTable) {
        await db.schema.createTable('skill_user', (table) => {
            table.increments();
            table.integer('user_id');
            table.integer('skill_id');
            table.string('proficiency');
            table.timestamps();
        });
    }
    const hasPostsTable = await db.schema.hasTable('posts');
    if (!hasPostsTable) {
        await db.schema.createTable('posts', (table) => {
            table.increments();
            table.integer('user_id');
            table.integer('tenant_id').nullable();
            table.string('title').notNullable();
            table.boolean('is_published').defaultTo(false);
            table.timestamps();
        });
    }
    const hasComments = await db.schema.hasTable('comments');
    if (!hasComments) {
        await db.schema.createTable('comments', (table) => {
            table.increments();
            table.integer('tenant_id').nullable();
            table.integer('post_id');
            table.string('body');
            table.timestamps();
        });
    }
    const hasProfilesTable = await db.schema.hasTable('profiles');
    if (!hasProfilesTable) {
        await db.schema.createTable('profiles', (table) => {
            table.increments();
            table.integer('user_id');
            table.string('display_name').notNullable();
            table.string('type').nullable();
            table.timestamps();
        });
    }
    const hasIdentitiesTable = await db.schema.hasTable('identities');
    if (!hasIdentitiesTable) {
        await db.schema.createTable('identities', (table) => {
            table.increments();
            table.integer('profile_id');
            table.string('identity_name');
            table.timestamps();
        });
    }
    const hasGroupsTable = await db.schema.hasTable('groups');
    if (!hasGroupsTable) {
        await db.schema.createTable('groups', (table) => {
            table.increments();
            table.string('name').notNullable();
            table.timestamps();
        });
    }
    const hasGroupUsersTable = await db.schema.hasTable('group_user');
    if (!hasGroupUsersTable) {
        await db.schema.createTable('group_user', (table) => {
            table.increments();
            table.integer('group_id');
            table.integer('user_id');
            table.timestamps();
        });
    }
    if (destroyDb) {
        await db.destroy();
    }
}
/**
 * Does cleanup removes database
 */
export async function cleanup(customTables) {
    const db = getKnex(Object.assign({}, getConfig(), { debug: false }));
    if (customTables) {
        for (let table of customTables) {
            await db.schema.dropTableIfExists(table);
        }
        await db.destroy();
        return;
    }
    await db.schema.dropTableIfExists('users');
    await db.schema.dropTableIfExists('uuid_users');
    await db.schema.dropTableIfExists('follows');
    await db.schema.dropTableIfExists('friends');
    await db.schema.dropTableIfExists('countries');
    await db.schema.dropTableIfExists('skills');
    await db.schema.dropTableIfExists('skill_user');
    await db.schema.dropTableIfExists('profiles');
    await db.schema.dropTableIfExists('posts');
    await db.schema.dropTableIfExists('comments');
    await db.schema.dropTableIfExists('identities');
    await db.schema.dropTableIfExists('knex_migrations');
    await db.schema.dropTableIfExists('groups');
    await db.schema.dropTableIfExists('group_user');
    await db.destroy();
}
/**
 * Reset database tables
 */
export async function resetTables() {
    const db = getKnex(Object.assign({}, getConfig(), { debug: false }));
    await db.table('users').truncate();
    await db.table('uuid_users').truncate();
    await db.table('follows').truncate();
    await db.table('friends').truncate();
    await db.table('countries').truncate();
    await db.table('skills').truncate();
    await db.table('skill_user').truncate();
    await db.table('profiles').truncate();
    await db.table('posts').truncate();
    await db.table('comments').truncate();
    await db.table('identities').truncate();
    await db.table('groups').truncate();
    await db.table('group_user').truncate();
    await db.destroy();
}
/**
 * Returns the query client typed to it's interface
 */
export function getQueryClient(connection, eventEmitter, mode) {
    return new QueryClient(mode || 'dual', connection, eventEmitter || emitter);
}
/**
 * Returns query builder instance for a given connection
 */
export function getQueryBuilder(client) {
    return new DatabaseQueryBuilder(client.getWriteClient().queryBuilder(), client);
}
/**
 * Returns raw query builder instance for a given connection
 */
export function getRawQueryBuilder(client, sql, bindings) {
    const writeClient = client.getWriteClient();
    return new RawQueryBuilder(bindings ? writeClient.raw(sql, bindings) : writeClient.raw(sql), client);
}
/**
 * Returns query builder instance for a given connection
 */
export function getInsertBuilder(client) {
    return new InsertQueryBuilder(client.getWriteClient().queryBuilder(), client);
}
/**
 * Returns the database instance
 */
export function getDb(eventEmitter, config) {
    const defaultConfig = {
        connection: 'primary',
        connections: {
            primary: getConfig(),
            secondary: getConfig(),
        },
    };
    const db = new Database(config || defaultConfig, logger, eventEmitter || createEmitter());
    const test = getActiveTest();
    test?.cleanup(() => {
        return db.manager.closeAll();
    });
    return db;
}
/**
 * Returns the orm adapter
 */
export function ormAdapter(db) {
    return new Adapter(db);
}
/**
 * Returns the base model with the adapter attached to it
 */
export function getBaseModel(adapter) {
    BaseModel.$adapter = adapter;
    return BaseModel;
}
/**
 * Fake adapter implementation
 */
export class FakeAdapter {
    operations = [];
    _handlers = {
        insert: null,
        update: null,
        find: null,
        delete: null,
        findAll: null,
        refresh: null,
    };
    _invokeHandler(action, model, options) {
        if (typeof this._handlers[action] === 'function') {
            return this._handlers[action](model, options);
        }
    }
    query() {
        return {
            client: {
                dialect: {
                    dateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
                },
            },
        };
    }
    on(action, handler) {
        this._handlers[action] = handler;
    }
    modelClient() { }
    modelConstructorClient() { }
    async insert(instance, attributes) {
        this.operations.push({ type: 'insert', instance, attributes });
        return this._invokeHandler('insert', instance, attributes);
    }
    async refresh(instance) {
        this.operations.push({ type: 'refresh', instance });
        return this._invokeHandler('refresh', instance);
    }
    async delete(instance) {
        this.operations.push({ type: 'delete', instance });
        return this._invokeHandler('delete', instance);
    }
    async update(instance, attributes) {
        this.operations.push({ type: 'update', instance, attributes });
        return this._invokeHandler('update', instance, attributes);
    }
    async find(model, key, value, options) {
        const payload = { type: 'find', model, key, value };
        if (options) {
            payload.options = options;
        }
        this.operations.push(payload);
        return this._invokeHandler('find', model, options);
    }
    async findAll(model, options) {
        const payload = { type: 'findAll', model };
        if (options) {
            payload.options = options;
        }
        this.operations.push(payload);
        return this._invokeHandler('findAll', model, options);
    }
}
/**
 * Converts a map to an object
 */
export function mapToObj(collection) {
    let obj = {};
    collection.forEach((value, key) => {
        ;
        obj[key] = value;
    });
    return obj;
}
/**
 * Returns the base schema class typed to it's interface
 */
export function getBaseSchema() {
    return BaseSchema;
}
/**
 * Returns instance of migrator
 */
export function getMigrator(db, application, config) {
    return new MigrationRunner(db, application, config);
}
/**
 * Split string to an array using cross platform new lines
 */
export function toNewlineArray(contents) {
    return contents.split(/\r?\n/);
}
/**
 * Returns an array of users filled with random data
 */
export function getUsers(count) {
    const chance = new Chance();
    return [...new Array(count)].map(() => {
        return {
            username: chance.string({ alpha: true }),
            email: chance.email(),
        };
    });
}
/**
 * Returns an array of posts for a given user, filled with random data
 */
export function getPosts(count, userId) {
    const chance = new Chance();
    return [...new Array(count)].map(() => {
        return {
            user_id: userId,
            title: chance.sentence({ words: 5 }),
        };
    });
}
export async function setupReplicaDb(connection, datatoInsert) {
    const hasUsersTable = await connection.schema.hasTable('replica_users');
    if (!hasUsersTable) {
        await connection.schema.createTable('replica_users', (table) => {
            table.increments();
            table.string('username');
        });
    }
    await connection.table('replica_users').insert(datatoInsert);
}
export async function cleanupReplicaDb(connection) {
    await connection.schema.dropTable('replica_users');
}
export function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}
export function replaceFactoryBindings(source, model, importPath) {
    return toNewlineArray(source
        .replace('{{{ modelImportPath }}}', importPath)
        .replace(/{{#toModelName}}{{{ model }}}{{\/toModelName}}/gi, model));
}
