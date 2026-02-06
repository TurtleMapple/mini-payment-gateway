"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260205020647 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260205020647 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table \`payments\` (\`id\` int unsigned not null auto_increment primary key, \`payment_id\` varchar(255) not null, \`amount\` int not null, \`currency\` varchar(3) not null, \`status\` varchar(255) not null, \`created_at\` datetime not null, \`updated_at\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
        this.addSql(`alter table \`payments\` add unique \`payments_payment_id_unique\`(\`payment_id\`);`);
    }
}
exports.Migration20260205020647 = Migration20260205020647;
