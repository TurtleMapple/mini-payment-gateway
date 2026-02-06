"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260205024934 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260205024934 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table \`payments\` modify \`id\` varchar(255) not null;`);
    }
    async down() {
        this.addSql(`alter table \`payments\` modify \`id\` int unsigned not null auto_increment;`);
    }
}
exports.Migration20260205024934 = Migration20260205024934;
