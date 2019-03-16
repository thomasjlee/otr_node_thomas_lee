# Feedback from OTR

## Positive
`"He felt your code clarity (understandability and ability to modify) was good."`

`"He felt your code structure was good for your level of experience."`

`"Lastly, your readme was good and he was able to get the assignment to run without looking at the code."`

## Areas for Improvement
`"He thought you followed the ruby convention on how you passed in your JSON data to the server."`

- Currently, the format for POST body and response body are:
```
POST /records
request body:
{
  "records" : [
    "record_one,first_name,gender,favorite_color,date_of_birth",
    "record_two,first_name,gender,favorite_color,date_of_birth",
    ...
  ]
}

response body:
{
  "status": "success",
  "data": {
    "records": [
      {
        "firstName": "first_name",
        "lastName": "record_one",
        ...
      },
      {
        // second_record
      }
    ]
  }
}
```

- The POST request body could be improved by passing an array of JSON rather than array of strings, like:

```
POST /records
request body:
[
  {
    "lastName": "record_one",
    "firstName": "first_name",
    "gender": "male",
    ...
  },
  { // another record JSON }
]
```

`"Results had some extra detail."`

- And the POST response body could have had a simpler format, like:
```
{
  "records": [
    { // record_one },
    { // record_two },
    ...
  ]
}
```

`"He felt your tests were good, but have room for improvement. He mentioned you only tested positive (“it should”) and not the negative (“it should not”)."`

- I could have added more error handling and data validations, for example
  - Handling CSV or .txt files with incorrect formats (mixing delimiters, for example)
  - Validate formats of dates

- I'm not sure what other "should not" tests I could have written