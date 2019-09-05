const index = require('../index');

const pool = index.pool;

describe('#index', () => {
  it('Connects to the database.', (done) => {
    pool.query('SELECT NOW()', (err) => {
      if (err) {
        console.log(err);
        done(err);
      } else {
        done();
      }
    });
  });
});
