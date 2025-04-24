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
import { column, hasMany } from '../../src/orm/decorators/index.js';
import { setup, getDb, cleanup, ormAdapter, resetTables, getBaseModel, } from '../../test-helpers/index.js';
import { AppFactory } from '@adonisjs/core/factories/app';
const factoryManager = new FactoryManager();
test.group('Factory | HasMany | make', (group) => {
    group.setup(async () => {
        await setup();
    });
    group.teardown(async () => {
        await cleanup();
    });
    group.each.teardown(async () => {
        await resetTables();
    });
    test('makeStubbed model with relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "id", void 0);
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory.with('posts').makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.exists(user.id);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.exists(user.posts[0].id);
        assert.isFalse(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
    });
    test('pass custom attributes to relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 1, (related) => related.merge({ title: 'Lucid 101' }))
            .makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isFalse(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
    });
    test('make many relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 2, (related) => related.merge({ title: 'Lucid 101' }))
            .makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.lengthOf(user.posts, 2);
        assert.instanceOf(user.posts[0], Post);
        assert.isFalse(user.posts[0].$isPersisted);
        assert.isFalse(user.posts[1].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[1].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
        assert.equal(user.posts[1].title, 'Lucid 101');
    });
    test('merge attributes with the relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 2, (related) => related.merge({ title: 'Lucid 101' }))
            .mergeRecursive({ tenantId: 1 })
            .makeStubbed();
        assert.isFalse(user.$isPersisted);
        assert.equal(user.tenantId, 1);
        assert.lengthOf(user.posts, 2);
        assert.instanceOf(user.posts[0], Post);
        assert.isFalse(user.posts[0].$isPersisted);
        assert.isFalse(user.posts[1].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[1].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
        assert.equal(user.posts[1].title, 'Lucid 101');
        assert.equal(user.posts[0].tenantId, 1);
        assert.equal(user.posts[1].tenantId, 1);
    });
});
test.group('Factory | HasMany | create', (group) => {
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
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory.with('posts').create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        const users = await db.from('users').select('*');
        const posts = await db.from('posts').select('*');
        assert.lengthOf(posts, 1);
        assert.lengthOf(users, 1);
        assert.equal(posts[0].user_id, users[0].id);
    });
    test('pass custom attributes to relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 1, (related) => related.merge({ title: 'Lucid 101' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
    });
    test('create many relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 2, (related) => related.merge({ title: 'Lucid 101' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 2);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
        assert.instanceOf(user.posts[1], Post);
        assert.isTrue(user.posts[1].$isPersisted);
        assert.equal(user.posts[1].userId, user.id);
        assert.equal(user.posts[1].title, 'Lucid 101');
    });
    test('create many relationship with different states', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 2, (related) => related.merge({ title: 'Lucid 101' }))
            .with('posts', 2, (related) => related.merge({ title: 'Lucid 101', tenantId: 1 }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 4);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
        assert.instanceOf(user.posts[1], Post);
        assert.isTrue(user.posts[1].$isPersisted);
        assert.equal(user.posts[1].userId, user.id);
        assert.equal(user.posts[1].title, 'Lucid 101');
        assert.instanceOf(user.posts[2], Post);
        assert.isTrue(user.posts[2].$isPersisted);
        assert.equal(user.posts[2].userId, user.id);
        assert.equal(user.posts[2].tenantId, 1);
        assert.equal(user.posts[2].title, 'Lucid 101');
        assert.instanceOf(user.posts[3], Post);
        assert.isTrue(user.posts[3].$isPersisted);
        assert.equal(user.posts[3].userId, user.id);
        assert.equal(user.posts[3].tenantId, 1);
        assert.equal(user.posts[3].title, 'Lucid 101');
    });
    test('create relationship with custom foreign key', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column({ columnName: 'user_id' })
        ], Post.prototype, "authorId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post, { foreignKey: 'authorId' })
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .with('posts', 1, (related) => related.merge({ title: 'Lucid 101' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].authorId, user.id);
        assert.equal(user.posts[0].title, 'Lucid 101');
    });
    test('rollback changes on error', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        assert.plan(3);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
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
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {};
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        try {
            await factory.with('posts').create();
        }
        catch (error) {
            assert.exists(error);
        }
        const users = await db.from('users').exec();
        const posts = await db.from('posts').exec();
        assert.lengthOf(users, 0);
        assert.lengthOf(posts, 0);
    });
    test('pass custom attributes to relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Post extends BaseModel {
        }
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        Post.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .mergeRecursive({ tenantId: 1 })
            .with('posts', 1, (related) => related.merge({ title: 'Lucid 101' }))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.equal(user.tenantId, 1);
        assert.lengthOf(user.posts, 1);
        assert.instanceOf(user.posts[0], Post);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].userId, user.id);
        assert.equal(user.posts[0].tenantId, 1);
        assert.equal(user.posts[0].title, 'Lucid 101');
    });
    test('pass custom attributes to deep nested relationship', async ({ fs, assert }) => {
        const app = new AppFactory().create(fs.baseUrl, () => { });
        await app.init();
        const db = getDb();
        const adapter = ormAdapter(db);
        const BaseModel = getBaseModel(adapter);
        class Comment extends BaseModel {
        }
        __decorate([
            column()
        ], Comment.prototype, "postId", void 0);
        __decorate([
            column()
        ], Comment.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], Comment.prototype, "body", void 0);
        Comment.boot();
        class Post extends BaseModel {
        }
        __decorate([
            column({ isPrimary: true })
        ], Post.prototype, "id", void 0);
        __decorate([
            column()
        ], Post.prototype, "userId", void 0);
        __decorate([
            column()
        ], Post.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], Post.prototype, "title", void 0);
        __decorate([
            hasMany(() => Comment)
        ], Post.prototype, "comments", void 0);
        Post.boot();
        class User extends BaseModel {
            points = 0;
        }
        __decorate([
            column({ isPrimary: true })
        ], User.prototype, "id", void 0);
        __decorate([
            column()
        ], User.prototype, "tenantId", void 0);
        __decorate([
            column()
        ], User.prototype, "username", void 0);
        __decorate([
            column()
        ], User.prototype, "points", void 0);
        __decorate([
            hasMany(() => Post)
        ], User.prototype, "posts", void 0);
        const commentFactory = factoryManager
            .define(Comment, () => {
            return {
                body: 'Nice post',
            };
        })
            .build();
        const postFactory = factoryManager
            .define(Post, () => {
            return {
                title: 'Adonis 101',
            };
        })
            .relation('comments', () => commentFactory)
            .build();
        const factory = factoryManager
            .define(User, () => {
            return {};
        })
            .relation('posts', () => postFactory)
            .build();
        const user = await factory
            .mergeRecursive({ tenantId: 1 })
            .with('posts', 1, (related) => related.with('comments'))
            .create();
        assert.isTrue(user.$isPersisted);
        assert.equal(user.tenantId, 1);
        assert.lengthOf(user.posts, 1);
        assert.isTrue(user.posts[0].$isPersisted);
        assert.equal(user.posts[0].tenantId, 1);
        assert.lengthOf(user.posts[0].comments, 1);
        assert.isTrue(user.posts[0].comments[0].$isPersisted);
        assert.equal(user.posts[0].comments[0].tenantId, 1);
    });
});
