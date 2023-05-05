export const TypeOrmTestingConfig = (): any => {
  return {
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true,
  };
};
