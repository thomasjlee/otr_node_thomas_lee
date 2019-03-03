import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import RecordManager from './src/record-manager';
import recordsRouter from './src/routes/records';

export default class RecordManagerAPI {
  constructor(recordManager, koaApp = new Koa()) {
    this.store = { recordManager };
    this.app = koaApp;
    this.init();
  }

  init() {
    this.app.use(bodyParser());
    this.app.use(json());
    this.app.use((ctx, next) => {
      ctx.state.recordManager = this.store.recordManager;
      next();
    });
    this.app.use(recordsRouter.routes());
  }
}

const app = new Koa();
const recordManager = new RecordManager();
const recordManagerApi = new RecordManagerAPI(recordManager, app);

if (process.env.NODE_ENV !== 'test') {
  recordManagerApi.app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
  });
}
