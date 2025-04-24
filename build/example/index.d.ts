import { DateTime } from 'luxon';
import { BaseModel } from '../src/orm/base_model/index.js';
import { HasOne } from '../src/types/relations.js';
import { ModelQueryBuilderContract } from '../src/types/model.js';
declare enum ProfileTypes {
    TWITTER = "TWITTER"
}
type Builder = ModelQueryBuilderContract<typeof User>;
declare class Profile extends BaseModel {
    id: string;
    userId: string;
    user: HasOne<typeof User>;
    type: ProfileTypes;
    createdAt?: DateTime;
}
export declare class User extends BaseModel {
    id: string;
    username: string;
    profile: HasOne<typeof Profile>;
    static active: import("../src/types/model.js").QueryScope<typeof User, (builder: Builder) => void>;
    static country: import("../src/types/model.js").QueryScope<import("../src/types/model.js").LucidModel, (builder: ModelQueryBuilderContract<import("../src/types/model.js").LucidModel, import("../src/types/model.js").LucidRow>, _country: string) => void>;
}
export {};
