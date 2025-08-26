describe('GraphQL API Tests for Users and Albums', () => {
  const url = 'https://graphqlzero.almansi.me/api'

  // --- USERS ---

  it('Query: fetch user by ID successfully', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          query ($id: ID!) {
            user(id: $id) {
              id
              name
              email
            }
          }
        `,
        variables: {
          id: "4",
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.user.id).to.eq("4")
      expect(response.body.data.user).to.have.property('name')
    })
  })

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

  it('Query: fetch albums of a user', () => {
    cy.request({
      method: 'POST',
      url,
      body: {
        query: `
          query ($id: ID!) {
            user(id: $id) {
                albums {
                    data {
                    id
                    title
                    }
                }
             }
          }
        `,
        variables: {
          id: "1",
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.user.albums.data.length).to.be.greaterThan(0)
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
            username: "KireN94",
            email: "kire@test.com",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.createUser).to.have.property('id')
      expect(response.body.data.createUser.name).to.eq("Kire")
      expect(response.body.data.createUser.username).to.eq("KireN94")
      expect(response.body.data.createUser.email).to.eq("kire@test.com")
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
            name: "Updated Kire",
            email: "updatedkire@test.com",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.updateUser.name).to.eq("Updated Kire")
      expect(response.body.data.updateUser.email).to.eq("updatedkire@test.com")
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
            title: "Test Kire's Album",
            userId: "1",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.createAlbum).to.have.property('id')
      expect(response.body.data.createAlbum.title).to.eq("Test Kire's Album")
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
            title: "Updated Kire's Album",
          },
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.updateAlbum.title).to.eq("Updated Kire's Album")
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
