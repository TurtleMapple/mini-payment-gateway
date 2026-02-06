import { Migration } from '@mikro-orm/migrations';

export class Migration20260205024934 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`payments\` modify \`id\` varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`payments\` modify \`id\` int unsigned not null auto_increment;`);
  }

}
