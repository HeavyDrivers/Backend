const fs = require("fs");
const csv = require("csvtojson");
const { MongoClient } = require("mongodb");

const csvFilePath = "exp1_14drivers_14cars_dailyRoutes.csv";
const columnName = "SPEED"; // Change this to the actual column name

// MongoDB connection URL
const mongoURL =
  "mongodb+srv://rahulsharma4329:Rahul4329@cluster0.2cbpk2f.mongodb.net/LocationDb"; // Change this to your MongoDB server URL

// Function to read CSV file and insert data into MongoDB
async function csvToMongo() {
  try {
    // Convert CSV to JSON
    const jsonArray = await csv().fromFile(csvFilePath);

    // Check if the column exists in the first row of the CSV
    if (!jsonArray[0].hasOwnProperty(columnName)) {
      console.log(`Column '${columnName}' not found in the CSV.`);
      return;
    }

    // Extract the specified column data
    const columnData = jsonArray.map((row) => row[columnName]);

    // Connect to MongoDB
    const client = new MongoClient(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to MongoDB");

    // Choose your database and collection
    const database = client.db("LocationDb"); // Change this to your database name
    const collection = database.collection("speeds"); // Change this to your collection name

    // Insert data into MongoDB
    const result = await collection.insertMany(
      columnData.map((value) => ({ value }))
    );

    console.log(`${result.insertedCount} documents inserted into MongoDB`);

    // Close MongoDB connection
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the function
csvToMongo();
