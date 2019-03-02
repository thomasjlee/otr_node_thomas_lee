import RecordManager from './src/record-manager';

const printUsage = () => {
  console.log('Import files with the --files flag\n');
  console.log('Example:');
  console.log('   npm run task-one --files ./file/one ./file/two ...');
};

(async () => {
  const [,, ...args] = process.argv;

  if (args[0] !== '--files') {
    printUsage();
    return;
  }

  const sortFlagIndex = args.indexOf('--sort');

  let files;
  if (sortFlagIndex >= 0) {
    files = args.slice(1, sortFlagIndex);
  } else {
    files = args.slice(1);
  }

  if (!files.length) {
    console.log('Please provide one or more files to import.');
    printUsage();
    return;
  }

  const recordManager = new RecordManager();
  for (let file of files) {
    await recordManager.importFromFile(file);
  }

  console.log(recordManager.records)
})();
