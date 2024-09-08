const scrape = async (vin) => {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`, {
      method: 'GET',
    });

    if (!response.ok ) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const result = await response.json() 
    const result_list = result['Results'] //this is a list of objects but json is formatted weird
    //


    let new_model_object = {}
    for (const index in result_list){ //looping through the list given by the get request
      const variable = String(result_list[index].Variable) //fixing the object by putting the Variable as the key and Value as the Value in the new object
      const value = result_list[index].Value
      new_model_object[variable] = value
    }


    const recalls = await fetch(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${new_model_object.Make}&model=${new_model_object.Model}&modelYear=${new_model_object["Model Year"]}`, {
      method: 'GET', // this calls the recall API with make, model, and year as params
    });

    const recall_response = await recalls.json()

    new_model_object["Recalls"] = recall_response["results"] //updating object to include the list of json recalls


    return new_model_object

  } catch (error) {
    console.error('Error during get Request:', error);
    throw error;
  }
};

const formatData = (result) => {
  var attributes_list = [];

  Object.keys(result).forEach(function (key) {
    // Only add the key-value pair if the value exists, is not 'Not Applicable', and is not the "Recalls" field
    if (result[key] && result[key] !== 'Not Applicable' && key !== "Recalls") {
      attributes_list.push(`${key}: ${result[key]} \n`);
    }
  });

  var recall_list = [];
  // Safely check if the "Recalls" field exists and is an array before processing
  if (Array.isArray(result["Recalls"])) {
    result["Recalls"].forEach(function (recall) {
      // Check if recall object exists before trying to access its properties
      if (recall && typeof recall === 'object') {
        Object.keys(recall).forEach(function (index) {
          recall_list.push(`${index}: \n ${recall[index]}  \n`);
        });
      }
    });
  } else {
    // If "Recalls" is missing or not an array, log a warning or handle accordingly
    console.warn("Recalls data is missing or not an array.");
  }

  // Return the formatted attributes and recall lists
  return { attributes_list, recall_list };
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { vin } = body;

    if (!vin) {
      throw new Error('VIN is missing');
    }

    const scrapedData = await scrape(vin); // Use the scrape function to get the data

    const formattedData = formatData(scrapedData)

    return new Response(JSON.stringify({ success: true, message: formattedData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
