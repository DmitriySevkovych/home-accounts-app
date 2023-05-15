import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class ExpenseType {
    @PrimaryColumn()
    type: string

    @Column()
    description: string
}
