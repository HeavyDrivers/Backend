const fs = require("fs");
const csv = require("csvtojson");
const { MongoClient } = require("mongodb");

const csvFilePath = "exp1_14drivers_14cars_dailyRoutes.csv";
const columnName = "THROTTLE_POS"; // Change this to the actual column name
const maxFrequency = 1000; // Maximum frequency limit

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

    // Extract the specified column data and convert to numeric values
    const columnData = jsonArray.map((row) => {
      // Extract numeric part from strings like "24%"
      const numericValue = parseFloat(row[columnName].replace("%", ""));
      return isNaN(numericValue) ? null : numericValue; // Return null for non-numeric values
    });

    // Filter out null and 0 values
    const filteredData = columnData.filter(
      (value) => value !== null && value !== 0
    );

    // Connect to MongoDB
    const client = new MongoClient(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to MongoDB");

    // Choose your database and collection
    const database = client.db("LocationDb"); // Change this to your database name
    const collection = database.collection("throttlepos"); // Change this to your collection name

    let counter = 0; // Counter for tracking the frequency

    // Insert data into MongoDB with frequency check
    const result = await collection.insertMany(
      filteredData.slice(0, maxFrequency).map((value) => ({ value }))
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

// const fs = require("fs");
// const csv = require("csvtojson");
// const { MongoClient } = require("mongodb");

// const csvFilePath = "exp1_14drivers_14cars_dailyRoutes.csv";
// const columnName = "ENGINE_RPM"; // Change this to the actual column name
// const maxFrequency = 1000; // Maximum frequency limit

// // MongoDB connection URL
// const mongoURL =
//   "mongodb+srv://rahulsharma4329:Rahul4329@cluster0.2cbpk2f.mongodb.net/LocationDb"; // Change this to your MongoDB server URL

// // Function to read CSV file and insert data into MongoDB
// async function csvToMongo() {
//   try {
//     // Convert CSV to JSON
//     const jsonArray = await csv().fromFile(csvFilePath);

//     // Check if the column exists in the first row of the CSV
//     if (!jsonArray[0].hasOwnProperty(columnName)) {
//       console.log(`Column '${columnName}' not found in the CSV.`);
//       return;
//     }

//     // Extract the specified column data and convert to numbers
//     const columnData = jsonArray.map((row) => Number(row[columnName]));

//     // Filter out records with a value of 0
//     const filteredData = columnData.filter((value) => value !== 0);

//     // Connect to MongoDB
//     const client = new MongoClient(mongoURL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     await client.connect();
//     console.log("Connected to MongoDB");

//     // Choose your database and collection
//     const database = client.db("LocationDb"); // Change this to your database name
//     const collection = database.collection("enginerpms"); // Change this to your collection name

//     let counter = 0; // Counter for tracking the frequency

//     // Insert data into MongoDB with frequency check
//     const result = await collection.insertMany(
//       filteredData.slice(0, maxFrequency).map((value) => ({ value }))
//     );

//     console.log(`${result.insertedCount} documents inserted into MongoDB`);

//     // Close MongoDB connection
//     await client.close();
//     console.log("Disconnected from MongoDB");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// // Run the function
// csvToMongo();

// for (let i = 0; i < temperatures.length; i++) {
//   const temperatureValue = temperatures[i].value;
//   const latitudeValue = latitudes[i].value;
//   const longitudeValue = longitudes[i].value;
//   const rpmValue = rpms[i].value;
//   const maxAccelXValue = maxAccelX[i].value;
//   const maxAccelYValue = maxAccelY[i].value;
//   const maxAccelZValue = maxAccelZ[i].value;add
//   const maxGyroXValue = maxGyroX[i].value;
//   const maxGyroYValue = maxGyroY[i].value;

//   latestData.push({
//     temperature: temperatureValue,
//     latitude: latitudeValue,
//     longitude: longitudeValue,
//     rpm: rpmValue,
//     maxAccelX: maxAccelXValue,
//     maxAccelY: maxAccelYValue,
//     maxAccelZ: maxAccelZValue,
//     maxGyroX: maxGyroXValue,
//     maxGyroY: maxGyroYValue,
//   });

// Send the response without the 'tempAlert' and 'latAlert' properties if no alerts were detected
