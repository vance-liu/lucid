/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { test } from '@japa/runner';
import { FactoryManager } from '../../src/factories/main.js';
import { column, belongsTo } from '../../src/orm/decorators/index.js';
import { setup, getDb, cleanup, ormAdapter, resetTables, getBaseModel, } from '../../test-helpers/index.js';
import { AppFactory } from '@adonisjs/core/factories/app';
const factoryManager = new FactoryManager();
test.group('Factory | BelongTo | make', (group) => {
    group.setup(async () => {
        await setup();
    });
    group.teardown(async () => {
        await cleanup();
    });
    group.each.teardown(async () => {
        await resetTables();
    });
    test('make stubbed model with relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Profile extends BaseModel {
        }
        __decorate([
            column()
        ], Profile.prototype, "id", void 0);
        __decorate([
            column()
        ], Profile.prototype, "userId", void 0);
        __decorate([
            column()
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            belongsTo(() => User)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        const profileFactory = factoryManager
            .define(Profile, () => {
            return {
                displayName: 'virk',
            };
        })
            .relation('user', () => factory)
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .build();
        const profile = await profileFactory.with('user').makeStubbed();
        assert.exists(profile.id);
        assert.isFalse(profile.$isPersisted);
        assert.exists(profile.user.id);
        assert.instanceOf(profile.user, User);
        assert.isFalse(profile.user.$isPersisted);
        assert.equal(profile.user.id, profile.userId);
    });
    test('pass custom attributes to the relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Profile extends BaseModel {
        }
        __decorate([
            column()
        ], Profile.prototype, "id", void 0);
        __decorate([
            column()
        ], Profile.prototype, "userId", void 0);
        __decorate([
            column()
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            belongsTo(() => User)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        const profileFactory = factoryManager
            .define(Profile, () => {
            return {
                displayName: 'virk',
            };
        })
            .relation('user', () => factory)
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {
                points: 0,
            };
        })
            .build();
        const profile = await profileFactory
            .with('user', 1, (related) => related.merge({ points: 10 }))
            .makeStubbed();
        assert.exists(profile.id);
        assert.isFalse(profile.$isPersisted);
        assert.instanceOf(profile.user, User);
        assert.exists(profile.user.id);
        assert.isFalse(profile.user.$isPersisted);
        assert.equal(profile.user.id, profile.userId);
        assert.equal(profile.user.points, 10);
    });
    test('invoke make hook on the related factory during make stubbed', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Profile extends BaseModel {
        }
        __decorate([
            column()
        ], Profile.prototype, "id", void 0);
        __decorate([
            column()
        ], Profile.prototype, "userId", void 0);
        __decorate([
            column()
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            belongsTo(() => User)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        User.boot();
        const profileFactory = factoryManager
            .define(Profile, () => {
            return {
                displayName: 'virk',
            };
        })
            .relation('user', () => factory)
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {
                points: 0,
            };
        })
            .after('make', (_, user) => {
            user.id = 100;
        })
            .build();
        const profile = await profileFactory
            .with('user', 1, (related) => related.merge({ points: 10 }))
            .makeStubbed();
        assert.exists(profile.id);
        assert.isFalse(profile.$isPersisted);
        assert.instanceOf(profile.user, User);
        assert.exists(profile.user.id);
        assert.equal(profile.user.points, 10);
        assert.isFalse(profile.user.$isPersisted);
        assert.equal(profile.userId, 100);
        assert.equal(profile.user.id, 100);
    });
});
test.group('Factory | BelongTo | create', (group) => {
    group.setup(async () => {
        await setup();
    });
    group.teardown(async () => {
        await cleanup();
    });
    group.each.teardown(async () => {
        await resetTables();
    });
    test('create model with relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Profile extends BaseModel {
        }
        __decorate([
            column()
        ], Profile.prototype, "userId", void 0);
        __decorate([
            column()
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            belongsTo(() => User)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        const profileFactory = factoryManager
            .define(Profile, () => {
            return {
                displayName: 'virk',
            };
        })
            .relation('user', () => factory)
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .build();
        const profile = await profileFactory.with('user').create();
        assert.isTrue(profile.$isPersisted);
        assert.instanceOf(profile.user, User);
        assert.isTrue(profile.user.$isPersisted);
        assert.equal(profile.user.id, profile.userId);
        const users = await db.from('users').select('*');
        const profiles = await db.from('profiles').select('*');
        assert.lengthOf(profiles, 1);
        assert.lengthOf(users, 1);
        assert.equal(profiles[0].user_id, users[0].id);
    });
    test('pass custom attributes to the relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Profile extends BaseModel {
        }
        __decorate([
            column()
        ], Profile.prototype, "userId", void 0);
        __decorate([
            column()
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            belongsTo(() => User)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        const profileFactory = factoryManager
            .define(Profile, () => {
            return {
                displayName: 'virk',
            };
        })
            .relation('user', () => factory)
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {
                points: 0,
            };
        })
            .build();
        const profile = await profileFactory
            .with('user', 1, (related) => related.merge({ points: 10 }))
            .create();
        assert.isTrue(profile.$isPersisted);
        assert.instanceOf(profile.user, User);
        assert.isTrue(profile.user.$isPersisted);
        assert.equal(profile.user.id, profile.userId);
        assert.equal(profile.user.points, 10);
    });
    test('create model with custom foreign key', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Profile extends BaseModel {
        }
        __decorate([
            column({ columnName: 'user_id' })
        ], Profile.prototype, "authorId", void 0);
        __decorate([
            column()
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            belongsTo(() => User, { foreignKey: 'authorId' })
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        const profileFactory = factoryManager
            .define(Profile, () => {
            return {
                displayName: 'virk',
            };
        })
            .relation('user', () => factory)
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {
                points: 0,
            };
        })
            .build();
        const profile = await profileFactory
            .with('user', 1, (related) => related.merge({ points: 10 }))
            .create();
        assert.isTrue(profile.$isPersisted);
        assert.instanceOf(profile.user, User);
        assert.isTrue(profile.user.$isPersisted);
        assert.equal(profile.user.id, profile.authorId);
        assert.equal(profile.user.points, 10);
    });
    test('rollback changes on error', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        assert.plan(3);
        class Profile extends BaseModel {
        }
        __decorate([
            column()
        ], Profile.prototype, "userId", void 0);
        __decorate([
            column()
        ], Profile.prototype, "displayName", void 0);
        __decorate([
            belongsTo(() => User)
        ], Profile.prototype, "user", void 0);
        Profile.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        const profileFactory = factoryManager
            .define(Profile, () => {
            return {
                displayName: 'virk',
            };
        })
            .relation('user', () => factory)
            .build();
        /**
         * Creating user in advance, so that the `user` relationship
         * create call raises a unique constraint exception.
         *
         * After the exception, we except the profile insert to be
         * rolled back as well.
         */
        await db.table('users').insert({ username: 'virk' });
        const factory = factoryManager
            .define(User, () => {
            return {
                username: 'virk',
            };
        })
            .build();
        try {
            await profileFactory.with('user').create();
        }
        catch (error) {
            assert.exists(error);
        }
        const profiles = await db.from('profiles').exec();
        const users = await db.from('users').exec();
        assert.lengthOf(profiles, 0);
        assert.lengthOf(users, 1); // one user still exists from the setup insert call
    });
});
