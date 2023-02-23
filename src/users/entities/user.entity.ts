import { Column, Entity, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm';

@Entity('user')
export class User {
  /**
   * User ID
   * @example 123
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * User\'s name
   * @example 'Edu'
   */
  @Column()
  public name: string;

  /**
   * User account\'s password
   * @example Password123
   */
  @Column()
  public password: string;

  /**
   * Whether user is admin
   * @example false
   */
  @Column({ type: 'bool', default: false })
  public isAdmin: boolean = false;

  /**
   * User creation timestamp
   * @example '2023-02-17T10:20:01.000Z'
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  /**
   * User last updated timestamp
   * @example '2023-02-17T10:20:01.000Z'
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}
