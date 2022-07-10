const {
  equal,
  deepEqual,
  ok
} = require('assert');

const PostgresStrategy = require('../src/db/strategies/postgres/postgresSQLStrategy');
const UserSchema = require('../src/db/strategies/postgres/schemas/userSchema')
const Context = require('../src/db/strategies/base/contextStrategy')
const nanoid = require('nanoid')

const MOCK_USER_CADASTRAR = {
  username:  nanoid(7),
  password: '8m6a7OFeQYE5LWmuJgPtFlvHveO5fN.kfsfhAAsbd8gM.DSAghrWw', 
}
const MOCK_USER_ATUALIZAR = {
  username: nanoid(7),
  password: nanoid(7)
}

let context = {}

describe('****Postgre Strategy Suite de Testes****', function () {
  this.timeout(Infinity);
  before(async () => {
    const connection = await PostgresStrategy.connect()
    const model = await PostgresStrategy.defineModel(connection, UserSchema)
    context = new Context(new PostgresStrategy(connection, model));

    await context.delete();
    await context.create(MOCK_USER_CADASTRAR);
    await context.create(MOCK_USER_ATUALIZAR);
  });

  it('T1 conexao', async () => {
    const result = await context.isConnected();
    equal(result, true);
  });
  
  //verificar 
  it('T2 cadastra', async () => {
    const result = await context.create(MOCK_USER_CADASTRAR);
    delete result.dataValues.id;
    deepEqual(result.dataValues, MOCK_USER_CADASTRAR);
  });

  it('T3 listar', async () => {
    const [result] = await context.read(MOCK_USER_CADASTRAR);
    delete result.id;
    deepEqual(result, MOCK_USER_CADASTRAR);
    console.log('result', result)
  });

  it('T4 atualiza', async () => {
    const [result] = await context.read({});

    const novoItem = {
      ...MOCK_USER_CADASTRAR,
      username: 'Bruce lee',
    };
    const [update] = await context.update(result.id, novoItem);

    deepEqual(update, 1);
  });

  it('T5 remove', async () => {
    const [item] = await context.read({});
    const result = await context.delete(item.id);
    deepEqual(result, 1);
  });
  
});