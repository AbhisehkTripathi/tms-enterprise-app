import { Query, Resolver, Mutation, Arg } from "type-graphql"
import { UserInput, User } from "@graphschema/user.schema"

/**
 * Seeded users: different quantities for admin (2) and employee (5) per doc.
 */
const SEEDED_USERS: User[] = [
  { id: 1, name: "Admin One", email: "admin1@tms.demo", role: "admin" },
  { id: 2, name: "Admin Two", email: "admin2@tms.demo", role: "admin" },
  { id: 3, name: "Employee One", email: "emp1@tms.demo", role: "employee" },
  { id: 4, name: "Employee Two", email: "emp2@tms.demo", role: "employee" },
  { id: 5, name: "Employee Three", email: "emp3@tms.demo", role: "employee" },
  { id: 6, name: "Employee Four", email: "emp4@tms.demo", role: "employee" },
  { id: 7, name: "Employee Five", email: "emp5@tms.demo", role: "employee" },
]

@Resolver(() => User)
export class UsersResolver {
  private users: User[] = [...SEEDED_USERS]

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.users
  }

  @Query(() => User)
  async getUser(@Arg("id") id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id)
  }

  @Mutation(() => User)
  async createUser(@Arg("input") input: UserInput): Promise<User> {
    const user: User = {
      id: this.users.length + 1,
      ...input,
    }
    this.users.push(user)
    return user
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("id") id: number,
    @Arg("input") input: UserInput
  ): Promise<User> {
    const user = this.users.find((u) => u.id === id)
    if (!user) throw new Error("User not found")
    const updatedUser = { ...user, ...input }
    this.users = this.users.map((u) => (u.id === id ? updatedUser : u))
    return updatedUser
  }
}