const request = require('supertest');
const User = require('../src/models/user');
const app = require('../src/app');
const { userOne, userOneId, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  const newUser = {
    name: 'Test',
    email: 'test@test.com',
    password: '12345678'
  };

  const response = await request(app).post('/users').send(newUser).expect(201);

  //Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: newUser.name,
      email: newUser.email,
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe(newUser.password);
});

test('Should login an existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(userOneId._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login a non existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'fake@user.com',
      password: '12345678'
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOne);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/upload.jpg')
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  const newName = 'Andres';
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({ name: newName })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe(newName);
});

test('Should not update invalid user fields', async () => {
  await request(app)
  .patch('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send({ color: 'red' })
  .expect(400);
});