import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { v7 as uuidv7 } from "uuid"

@Entity({ tableName: "payments" })
export class Payment {
  @PrimaryKey()
  id: string = uuidv7()

  @Property({ unique: true, fieldName: "payment_id" })
  paymentId: string = uuidv7()

  @Property()
  amount!: number

  @Property({ length: 3 })
  currency!: string

  @Property()
  status!: string

  @Property({ onCreate: () => new Date(), fieldName: "created_at" })
  createdAt?: Date

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date(), fieldName: "updated_at" })
  updatedAt?: Date
}
