describe('GraphQL API Tests for Users and Albums', () => {
  const url = 'https://graphqlzero.almansi.me/api'

  // --- USERS ---

  it('Query: fetch users successfully', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          query {
            users(options: { paginate: { page: 1, limit: 2 } }) {
              data {
                id
                name
                email
              }
            }
          }
        `,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.users.data.length).to.be.greaterThan(0)
    })
  })

  it('Mutation: create a user (simulated)', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          mutation ($input: CreateUserInput!) {
            createUser(input: $input) {
              id
              name
              username
              email
            }
          }
        `,
        variables: {
          input: {
            name: "Kire",
            username: "kiren94",
            email: "test@example.com",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.createUser).to.have.property('id')
      expect(response.body.data.createUser.name).to.eq("Kire")
    })
  })

  it('Mutation: update a user (simulated)', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          mutation ($id: ID!, $input: UpdateUserInput!) {
            updateUser(id: $id, input: $input) {
              id
              name
              email
            }
          }
        `,
        variables: {
          id: "1", // pretend we’re updating user with ID 1
          input: {
            name: "Updated User",
            email: "updated@example.com",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.updateUser.name).to.eq("Updated User")
    })
  })

  it('Error Handling: invalid user query', () => {
    cy.request({
      method: 'POST',
      url,
      failOnStatusCode: false,
      body: {
        query: `
          query {
            user {
              nonExistingField
            }
          }
        `,
      },
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.errors).to.exist
    })
  })

  // --- ALBUMS ---

  it('Query: fetch albums successfully', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          query {
            albums(options: { paginate: { page: 1, limit: 2 } }) {
              data {
                id
                title
                user {
                  id
                  name
                }
              }
            }
          }
        `,
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.albums.data.length).to.be.greaterThan(0)
    })
  })

  it('Mutation: create an album (simulated)', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          mutation ($input: CreateAlbumInput!) {
            createAlbum(input: $input) {
              id
              title
              user {
                id
              }
            }
          }
        `,
        variables: {
          input: {
            title: "Test Album",
            userId: "1",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.createAlbum).to.have.property('id')
      expect(response.body.data.createAlbum.title).to.eq("Test Album")
    })
  })

  it('Mutation: update an album (simulated)', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          mutation ($id: ID!, $input: UpdateAlbumInput!) {
            updateAlbum(id: $id, input: $input) {
              id
              title
            }
          }
        `,
        variables: {
          id: "1", // pretend we’re updating album with ID 1
          input: {
            title: "Updated Album",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.updateAlbum.title).to.eq("Updated Album")
    })
  })

  it('Error Handling: invalid album mutation', () => {
    cy.request({
      method: 'POST',
      url,
      failOnStatusCode: false,
      body: {
        query: `
          mutation {
            createAlbum(input: { invalidField: "wrong" }) {
              id
            }
          }
        `,
      },
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.errors).to.exist
    })
  })
})
