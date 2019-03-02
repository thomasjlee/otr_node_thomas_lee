import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import RecordManager from './src/record-manager';
import recordsRouter from './src/routes/records';

const app = new Koa();
app.use(bodyParser());
app.use(json());

const recordManager = new RecordManager();

// Pass a RecordManager instance between requests in lieu of a data store
app.use((ctx, next) => {
  ctx.state.recordManager = recordManager;
  next();
});

app.use(recordsRouter.routes());

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
