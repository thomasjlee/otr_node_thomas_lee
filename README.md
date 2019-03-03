# Setup

This sample was developed using Node 10 and Babel 7.

Setup:

1. Clone the repo
2. `cd otr_node_thomas_lee`
3. `npm install`

# Task 1

Solutions to Task 1 are displayed via the `task-one` npm script: `npm run task-one -- [args]`

Two flags are accepted: `--files` and `--sort`.

Pass files using their relative paths: `--files ./files/comma-delimited.csv`

Pass sort arguments with alternating sort keys and orders: `--sort gender asc lastName desc`

__Acceptable sort keys are gender, lastName, and dateOfBirth.__

__Acceptable order keys are asc and desc.__

Full example:

`npm run task-one -- --files ./files/comma-delimited.csv ./files/space-delimited.txt --sort gender asc lastName asc`

## PLEASE NOTE: The extra ` -- ` are required before passing arguments to the npm script.

## Solutions

**Output 1 – sorted by gender (females before males) then by last name ascending.**

`npm run task-one -- --files ./files/comma-delimited.csv ./files/pipe-delimited.txt ./files/space-delimited.txt --sort gender asc lastName asc`

**Output 2 – sorted by birth date, ascending.**

`npm run task-one -- --files ./files/comma-delimited.csv ./files/pipe-delimited.txt ./files/space-delimited.txt --sort dateOfBirth asc`

**Output 3 – sorted by last name, descending.**

`npm run task-one -- --files ./files/comma-delimited.csv ./files/pipe-delimited.txt ./files/space-delimited.txt --sort lastName desc`

# Task 2

Start the server with `npm start` or `npm run task-two`.

The Koa app is instantiated in `task-two.js`.

However, it is encapsulated within the RecordManagerAPI class so that a RecordManager
instance could be used as an in-memory store between requests. I'm doubtful that this is idiomatic,
but it made it easier to test.

# Tests

To run the tests, run `npm test`.

# Assumptions
__Task 1__

- Data contains no headers.
- Data sources contain clean records.
  - No NULL fields.
  - Consistent order of columns.
- Records are separated by new lines.
- Only two gender options, i.e. sex assigned at birth: female | male.

__Task 2__

- Requests made to POST /records will have this JSON format in the request body.

```
{
  "records": [
    "last_name,first_name,gender,favorite_color,date_of_birth",
    "last_name,first_name,gender,favorite_color,date_of_birth",
    ...
  ]
}
```
- The `records` array may also consist of strings with pipe "|" or space delimited fields, but must be consistent per request.
- Responses to all POST and GET requests consist of a `status` and `data` object containing a `records` key.
