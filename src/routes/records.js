import Router from 'koa-router';

const router = new Router();

export default router;

router.post('/records', ctx => {
  const { recordManager } = ctx.state;
  const { records } = ctx.request.body;

  recordManager.import(records);

  ctx.body = {
    status: 'success',
    data: {
      records: recordManager.records
    }
  };
});

router.get('/records/gender', ctx => {
  const { recordManager } = ctx.state;
  const sortedRecords = recordManager.sortedBy('gender', 'asc');

  ctx.body = {
    status: 'success',
    data: {
      records: sortedRecords
    }
  };
});

router.get('/records/birthdate', ctx => {
  const { recordManager } = ctx.state;
  const sortedRecords = recordManager.sortedBy('dateOfBirth', 'asc');

  ctx.body = {
    status: 'success',
    data: {
      records: sortedRecords
    }
  };
});

router.get('/records/name', ctx => {
  const { recordManager } = ctx.state;
  const sortedRecords = recordManager.sortedBy('lastName', 'asc');

  ctx.body = {
    status: 'success',
    data: {
      records: sortedRecords
    }
  };
});
