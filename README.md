# Expense API

This is a backend API to handle deposit and expense requests

- [Installation](#installation)
- [Frontend Repository](#frontend)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [License](#license)

## Installation

1. Clone Repository:<br>
   `git clone https://github.com/duanegero/ExpenseAPI.git`
2. Navigate to the Project Directory
3. Install Dependencies:<br>
   `npm install`
4. Start Server<br>
   `node index.js`

## Frontend

### React App

## API Endpoints

### Income/Deposit Endpoints

- GET `/income` - Get all deposits
- GET `/income/:id` - Get single deposit
- POST `/income` - Add new deposit
- PUT `/income/:id` - Update existing deposit

### Expense Endpoints

- GET `/expenses` - Get all expenses
- GET `/expenses/:id` - Get single expense
- POST `/expenses` - Add new expense
- PUT `/expenses/:id` - Update existing expense

## Usage

Once the server is running you can interact with the API through the available endpoints. Here is an example of how to add a new expense with `/expenses` POST endpoint using Postman or any HTTP client:

### Example Request (POST `/expenses`)

```
{
    "payee": "John",
    "amount": "10.99",
    "description": "Test description"
}
```

The API and Database will add ID and created_at timestamp columns

## License

This project is licensed under the MIT License.
