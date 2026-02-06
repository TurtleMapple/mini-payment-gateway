import { Migration } from '@mikro-orm/migrations';

export class Migration20260205020647 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`payments\` (\`id\` int unsigned not null auto_increment primary key, \`payment_id\` varchar(255) not null, \`amount\` int not null, \`currency\` varchar(3) not null, \`status\` varchar(255) not null, \`created_at\` datetime not null, \`updated_at\` datetime not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`payments\` add unique \`payments_payment_id_unique\`(\`payment_id\`);`);
  }

}