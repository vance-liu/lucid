var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseModel, scope } from '../src/orm/base_model/index.js';
import { column, hasOne } from '../src/orm/decorators/index.js';
import factory from '../src/factories/main.js';
var ProfileTypes;
(function (ProfileTypes) {
    ProfileTypes["TWITTER"] = "TWITTER";
})(ProfileTypes || (ProfileTypes = {}));
class Profile extends BaseModel {
}
__decorate([
    column.dateTime()
], Profile.prototype, "createdAt", void 0);
export class User extends BaseModel {
    static active = scope((builder) => {
        builder.apply((scopes) => scopes.country('India'));
    });
    static country = scope((builder, _country) => {
        builder.whereIn('', []);
    });
}
__decorate([
    hasOne(() => Profile, {
        onQuery: (builder) => {
            if (builder.isRelatedQuery) {
                builder.preload('user');
            }
        },
    })
], User.prototype, "profile", void 0);
User.query().apply((scopes) => scopes.active().country('India'));
User.create({ id: '1', username: 'a' });
User.fetchOrCreateMany('id', [{ id: '1', username: 'virk' }]);
User.create({ id: '1', username: 'virk' });
User.create({ id: '1', username: 'virk' });
User.create({ id: '1' });
const F = factory.define(User, ({ faker }) => {
    return {
        username: faker.internet.userName(),
    };
});
const P = factory.define(Profile, () => {
    return {};
});
const ProfileF = P.state('social', () => { }).build();
const UserF = F.state('active', (user) => {
    user.username = 'virk';
})
    .relation('profile', () => ProfileF)
    .build();
UserF.with('profile', 1).merge({});
User.query().withCount('profile', (query) => {
    query.where('isActive', true).has('user', '>', 1);
});
User.query().withCount('profile');
User.query()
    .paginate(1, 1)
    .then((users) => {
    users.forEach((user) => user.username);
});
const user = new User();
user.loadCount('profile');
