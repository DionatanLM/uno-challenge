const typeDefs = `#graphql
  type Item {
    id: Int
    name: String
    priority: String
    completed: Boolean
  }

  type MutationResult {
    success: Boolean!
    message: String
    item: Item
  }

  input ItemInput {
    id: Int
    name: String
    priority: String
    completed: Boolean
  }

  input ItemFilter {
    id: Int
    name: String
    priority: String
    completed: Boolean
  }

  type Query {
    todoList(
      filter: ItemFilter
      orderBy: String
      order: String
    ): [Item]
  }

  type Mutation {
    addItem(values: ItemInput): MutationResult
    updateItem(values: ItemInput): MutationResult
    deleteItem(id: Int!): MutationResult
    completeAll: Boolean
    clearAll: Boolean
  }
`;

module.exports = typeDefs;
